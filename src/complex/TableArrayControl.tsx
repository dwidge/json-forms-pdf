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

import React, { useState } from "react";
import {
  Button,
  IconButton,
  Text,
  View,
  DataTable,
  ScrollView,
  DeleteDialog,
} from "../styles/components";
import {
  ArrayControlProps,
  ControlElement,
  createDefaultValue,
  Helpers,
  Paths,
  RankedTester,
  Resolve,
  Test,
  getControlPath,
  encode,
  ArrayTranslations,
} from "@jsonforms/core";
import {
  DispatchCell,
  withArrayTranslationProps,
  withJsonFormsArrayControlProps,
  withTranslateProps,
} from "@jsonforms/react";
import { withVanillaControlProps } from "../util";
import type { VanillaRendererProps } from "../index";
import _ from "lodash";

const { convertToValidClassName } = Helpers;
const { or, isObjectArrayControl, isPrimitiveArrayControl, rankWith } = Test;

/**
 * Alternative tester for an array that also checks whether the 'table'
 * option is set.
 * @type {RankedTester}
 */
export const tableArrayControlTester: RankedTester = rankWith(
  3,
  or(isObjectArrayControl, isPrimitiveArrayControl),
);

interface TableArrayControlProps
  extends ArrayControlProps,
    VanillaRendererProps {
  translations: ArrayTranslations;
}

const TableArrayControl: React.FC<TableArrayControlProps> = (props) => {
  const {
    addItem,
    uischema,
    schema,
    rootSchema,
    path,
    data,
    visible,
    errors,
    label,
    getStyleAsClassName = () => "",
    childErrors,
    translations,
    enabled,
  } = props;

  const controlElement = uischema as ControlElement;
  const tableClass = getStyleAsClassName("array.table.table");
  const labelClass = getStyleAsClassName("array.table.label");
  const buttonClass = getStyleAsClassName("array.table.button");
  const validationClass = getStyleAsClassName("array.table.validation");
  const controlClass = [
    getStyleAsClassName("array.table"),
    convertToValidClassName(controlElement.scope),
  ].join(" ");
  const createControlElement = (key?: string): ControlElement => ({
    type: "Control",
    label: false,
    scope: schema.type === "object" ? `#/properties/${key}` : "#",
  });
  const isValid = errors.length === 0;
  const divClassNames = [validationClass]
    .concat(isValid ? "" : getStyleAsClassName("array.table.validation.error"))
    .join(" ");

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const openDeleteDialog = (path: string, index: number) => {
    setSelectedPath(path);
    setSelectedIndex(index);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    if (selectedPath !== null && selectedIndex !== null) {
      const p = selectedPath.substring(0, selectedPath.lastIndexOf("."));
      props.removeItems?.(p, [selectedIndex])();
    }
    setDeleteDialogVisible(false);
    setSelectedIndex(null);
    setSelectedPath(null);
  };

  const getJsonType = (prop: string) =>
    Resolve.schema(schema, `#/properties/${encode(prop)}`, rootSchema).type;

  if (!visible) return null;
  return (
    <View className={"table layout " + controlClass}>
      <View
        className={"table controls"}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text className={"table label " + labelClass}>{label}</Text>
        {/* <Button
          className={buttonClass}
          mode="contained"
          disabled={!enabled}
          onPress={addItem(path, createDefaultValue(schema, rootSchema))}
        >
          {translations.addTooltip}
        </Button> */}
      </View>
      {/* {!isValid && <Text className={divClassNames + " error"}>{errors}</Text>} */}
      <ScrollView
        horizontal
        // contentContainerStyle={{
        //   flexGrow: 1,
        // }}
      >
        <DataTable className="table container">
          <DataTable.Header className="table header">
            {schema.properties
              ? Object.keys(schema.properties)
                  .filter((prop) => schema.properties?.[prop].type !== "array")
                  .map((prop) => (
                    <DataTable.Title
                      key={prop}
                      className={"table label " + getJsonType(prop)}
                    >
                      {schema.properties?.[prop].title || _.startCase(prop)}
                    </DataTable.Title>
                  ))
              : null}
            {/* <DataTable.Title>Valid</DataTable.Title> */}
            {/* <DataTable.Title>Actions</DataTable.Title> */}
          </DataTable.Header>

          {!data || !Array.isArray(data) || data.length === 0 ? (
            <DataTable.Row className={"table row"}>
              <DataTable.Cell className="table cell">
                {translations.noDataMessage}
              </DataTable.Cell>
            </DataTable.Row>
          ) : (
            data.map((_child, index) => {
              const childPath = Paths.compose(path, `${index}`);
              const errorsPerEntry = childErrors?.filter((error) => {
                const errorPath = getControlPath(error);
                return errorPath.startsWith(childPath);
              });

              return (
                <DataTable.Row key={childPath} className="table row">
                  {schema.properties ? (
                    Object.keys(schema.properties)
                      .filter(
                        (prop) => schema.properties?.[prop].type !== "array",
                      )
                      .map((prop) => {
                        const jsonType = getJsonType(prop);
                        const childPropPath = Paths.compose(
                          childPath,
                          prop.toString(),
                        );
                        return (
                          <DataTable.Cell
                            key={childPropPath}
                            className={"table cell " + jsonType}
                          >
                            <DispatchCell
                              schema={Resolve.schema(
                                schema,
                                `#/properties/${encode(prop)}`,
                                rootSchema,
                              )}
                              uischema={createControlElement(encode(prop))}
                              path={`${childPath}.${prop}`}
                            />
                          </DataTable.Cell>
                        );
                      })
                  ) : (
                    <DataTable.Cell
                      key={Paths.compose(childPath, index.toString())}
                    >
                      <DispatchCell
                        schema={schema}
                        uischema={createControlElement()}
                        path={childPath}
                      />
                    </DataTable.Cell>
                  )}
                  {/* <DataTable.Cell>
                    <Text
                      style={{
                        color: errorsPerEntry.length
                          ? theme.colors.error
                          : theme.colors.primary,
                      }}
                    >
                      {errorsPerEntry.length
                        ? errorsPerEntry.map((e) => e.message).join(" and ")
                        : "OK"}
                    </Text>
                  </DataTable.Cell> */}
                  {/* <DataTable.Cell>
                    <IconButton
                      icon="delete"
                      onPress={() => openDeleteDialog(childPath, index)}
                      aria-label={translations.removeTooltip}
                    />
                  </DataTable.Cell> */}
                </DataTable.Row>
              );
            })
          )}
        </DataTable>
      </ScrollView>

      <DeleteDialog
        open={deleteDialogVisible}
        onClose={() => setDeleteDialogVisible(false)}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogVisible(false)}
        title={translations.deleteDialogTitle}
        message={translations.deleteDialogMessage}
        acceptText={translations.deleteDialogAccept}
        declineText={translations.deleteDialogDecline}
      />
    </View>
  );
};

export default withVanillaControlProps(
  withJsonFormsArrayControlProps(
    //@ts-expect-error
    withTranslateProps(withArrayTranslationProps(TableArrayControl)),
  ),
);
