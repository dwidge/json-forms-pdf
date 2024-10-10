/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

import {
  ArrayLayoutProps,
  ArrayTranslations,
  ControlElement,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  Paths,
  Resolve,
  UISchemaElement,
  encode,
  errorsAt,
  formatErrorMessage,
} from "@jsonforms/core";
import range from "lodash/range";
import startCase from "lodash/startCase";
import React, { useMemo } from "react";

import merge from "lodash/merge";
import { WithDeleteDialogSupport } from "./DeleteDialog";
import TableToolbar from "./TableToolbar";

import {
  DispatchCell,
  JsonFormsDispatch,
  JsonFormsStateContext,
} from "@jsonforms/react";
import { View, DataTable, Text, IconButton } from "../styles";
import NoBorderTableCell from "./NoBorderTableCell";
import { union } from "lodash";
import { ErrorObject } from "ajv";

const generateCells = (
  Cell: React.ComponentType<any>,
  schema: JsonSchema,
  rowPath: string,
  enabled: boolean,
  cells?: JsonFormsCellRendererRegistryEntry[],
) => {
  if (schema.type === "object") {
    return getValidColumnProps(schema).map((prop) => {
      const cellPath = Paths.compose(rowPath, prop);
      const props = {
        propName: prop,
        schema,
        title: schema.properties?.[prop]?.title ?? startCase(prop),
        rowPath,
        cellPath,
        enabled,
      };
      return <Cell key={cellPath} {...props} />;
    });
  } else {
    const props = {
      schema,
      rowPath,
      cellPath: rowPath,
      enabled,
    };
    return <Cell key={rowPath} {...props} />;
  }
};

const getValidColumnProps = (scopedSchema: JsonSchema) => {
  if (
    scopedSchema.type === "object" &&
    typeof scopedSchema.properties === "object"
  ) {
    return Object.keys(scopedSchema.properties).filter(
      (prop) => scopedSchema.properties?.[prop].type !== "array",
    );
  }
  return [""];
};

export interface EmptyTableProps {
  numColumns: number;
  translations: ArrayTranslations;
}
const EmptyTable = ({ numColumns, translations }: EmptyTableProps) => (
  <DataTable.Row>
    <DataTable.Cell>
      <Text>{translations.noDataMessage}</Text>
    </DataTable.Cell>
  </DataTable.Row>
);

interface TableHeaderCellProps {
  title: string;
}
const TableHeaderCell = React.memo(({ title }: TableHeaderCellProps) => (
  <DataTable.Title>{title}</DataTable.Title>
));

interface NonEmptyCellProps extends OwnPropsOfNonEmptyCell {
  rootSchema: JsonSchema;
  errors: string;
  path: string;
  enabled: boolean;
}
interface OwnPropsOfNonEmptyCell {
  rowPath: string;
  propName?: string;
  schema: JsonSchema;
  enabled: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
}

const ctxToNonEmptyCellProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfNonEmptyCell,
): NonEmptyCellProps => {
  const path =
    ownProps.rowPath +
    (ownProps.schema.type === "object" ? "." + ownProps.propName : "");
  const errors = formatErrorMessage(
    union(
      errorsAt(
        path,
        ownProps.schema,
        (p) => p === path,
      )(ctx.core?.errors ?? []).map(
        (error: ErrorObject) => error.message ?? "",
      ),
    ),
  );
  return {
    rowPath: ownProps.rowPath,
    propName: ownProps.propName,
    schema: ownProps.schema,
    rootSchema: ctx.core?.schema ?? {},
    errors,
    path,
    enabled: ownProps.enabled,
    cells: ownProps.cells || ctx.cells,
    renderers: ownProps.renderers || ctx.renderers,
  };
};

const controlWithoutLabel = (scope: string): ControlElement => ({
  type: "Control",
  scope: scope,
  label: false,
});

interface NonEmptyCellComponentProps {
  path: string;
  propName?: string;
  schema: JsonSchema;
  rootSchema: JsonSchema;
  errors: string;
  enabled: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
  isValid: boolean;
}
const NonEmptyCell = ({
  rowPath,
  propName = "",
  schema,
  enabled,
}: OwnPropsOfNonEmptyCell) => {
  const cellPath = Paths.compose(rowPath, propName);
  return (
    <DataTable.Cell>
      <JsonFormsDispatch
        schema={Resolve.schema(
          schema,
          `#/properties/${encode(propName)}`,
          schema,
        )}
        uischema={{
          type: "Control",
          //@ts-expect-error
          scope: `#/properties/${encode(propName)}`,
        }}
        path={cellPath}
        enabled={enabled}
      />
    </DataTable.Cell>
  );
};

interface NonEmptyRowProps {
  childPath: string;
  schema: JsonSchema;
  rowIndex: number;
  moveUpCreator?: (path: string, position: number) => () => void;
  moveDownCreator?: (path: string, position: number) => () => void;
  enableUp: boolean;
  enableDown: boolean;
  showSortButtons: boolean;
  enabled: boolean;
  cells?: JsonFormsCellRendererRegistryEntry[];
  path: string;
  translations: ArrayTranslations;
  disableRemove?: boolean;
}

const NonEmptyRowComponent = ({
  childPath,
  schema,
  rowIndex,
  openDeleteDialog,
  moveUpCreator,
  moveDownCreator,
  enableUp,
  enableDown,
  showSortButtons,
  enabled,
  path,
  translations,
  disableRemove,
}: NonEmptyRowProps & WithDeleteDialogSupport) => {
  const moveUp = useMemo(
    () => moveUpCreator?.(path, rowIndex),
    [moveUpCreator, path, rowIndex],
  );
  const moveDown = useMemo(
    () => moveDownCreator?.(path, rowIndex),
    [moveDownCreator, path, rowIndex],
  );

  return (
    <DataTable.Row key={childPath}>
      {generateCells(NonEmptyCell, schema, childPath, enabled)}
      {enabled && (
        <DataTable.Cell>
          <View style={{ flexDirection: "row" }}>
            {showSortButtons && (
              <>
                <IconButton
                  icon="arrow-up"
                  onPress={moveUp}
                  disabled={!enableUp}
                  aria-label={translations.upAriaLabel}
                />
                <IconButton
                  icon="arrow-down"
                  onPress={moveDown}
                  disabled={!enableDown}
                  aria-label={translations.downAriaLabel}
                />
              </>
            )}
            {!disableRemove && (
              <IconButton
                icon="delete"
                onPress={() => openDeleteDialog(childPath, rowIndex)}
                aria-label={translations.removeAriaLabel}
              />
            )}
          </View>
        </DataTable.Cell>
      )}
    </DataTable.Row>
  );
};

export const NonEmptyRow = React.memo(NonEmptyRowComponent);
interface TableRowsProp {
  data: number;
  path: string;
  schema: JsonSchema;
  uischema: ControlElement;
  config?: any;
  enabled: boolean;
  cells?: JsonFormsCellRendererRegistryEntry[];
  moveUp?(path: string, toMove: number): () => void;
  moveDown?(path: string, toMove: number): () => void;
  translations: ArrayTranslations;
  disableRemove?: boolean;
}
const TableRows = ({
  data,
  path,
  schema,
  openDeleteDialog,
  moveUp,
  moveDown,
  uischema,
  config,
  enabled,
  translations,
  disableRemove,
}: TableRowsProp & WithDeleteDialogSupport) => {
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  if (data === 0) {
    return (
      <EmptyTable
        numColumns={getValidColumnProps(schema).length + 1}
        translations={translations}
      />
    );
  }

  return (
    <>
      {range(data).map((index: number) => {
        const childPath = Paths.compose(path, `${index}`);
        return (
          <NonEmptyRow
            key={childPath}
            childPath={childPath}
            rowIndex={index}
            schema={schema}
            openDeleteDialog={openDeleteDialog}
            moveUpCreator={moveUp}
            moveDownCreator={moveDown}
            enableUp={index !== 0}
            enableDown={index !== data - 1}
            showSortButtons={
              appliedUiSchemaOptions.showSortButtons ||
              appliedUiSchemaOptions.showArrayTableSortButtons
            }
            enabled={enabled}
            path={path}
            translations={translations}
            disableRemove={disableRemove}
          />
        );
      })}
    </>
  );
};

export const MaterialTableControl: React.FC<
  ArrayLayoutProps &
    WithDeleteDialogSupport & { translations: ArrayTranslations }
> = (props) => {
  const {
    label,
    path,
    schema,
    rootSchema,
    uischema,
    errors,
    openDeleteDialog,
    visible,
    enabled,
    translations,
    disableAdd,
    disableRemove,
    config,
  } = props;

  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const doDisableAdd = disableAdd || appliedUiSchemaOptions.disableAdd;
  const doDisableRemove = disableRemove || appliedUiSchemaOptions.disableRemove;

  const isObjectSchema = schema.type === "object";

  if (!visible) {
    return null;
  }

  return (
    // <ScrollView horizontal>
    <DataTable>
      <TableToolbar
        errors={errors}
        label={label}
        description=""
        addItem={(path, value) => props.addItem(path, value)}
        numColumns={isObjectSchema ? getValidColumnProps(schema).length : 1}
        path={path}
        uischema={uischema as ControlElement}
        schema={schema}
        rootSchema={rootSchema}
        enabled={enabled}
        translations={translations}
        disableAdd={doDisableAdd}
      />
      {isObjectSchema && (
        <DataTable.Header>
          {generateCells(TableHeaderCell, schema, path, enabled)}
          {enabled && <DataTable.Title>{label}</DataTable.Title>}
        </DataTable.Header>
      )}
      <TableRows
        // openDeleteDialog={openDeleteDialog}
        // translations={translations}
        {...props}
        disableRemove={doDisableRemove}
      />
    </DataTable>
    // </ScrollView>
  );
};
