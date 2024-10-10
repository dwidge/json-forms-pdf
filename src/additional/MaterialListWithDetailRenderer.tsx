import {
  and,
  ArrayLayoutProps,
  ArrayTranslations,
  composePaths,
  computeLabel,
  createDefaultValue,
  findUISchema,
  isObjectArray,
  RankedTester,
  rankWith,
  uiTypeIs,
} from "@jsonforms/core";
import {
  JsonFormsDispatch,
  withArrayTranslationProps,
  withJsonFormsArrayLayoutProps,
  withTranslateProps,
} from "@jsonforms/react";
import React, { useCallback, useMemo, useState } from "react";
import { ArrayLayoutToolbar } from "../layouts/ArrayToolbar";
import ListWithDetailMasterItem from "./ListWithDetailMasterItem";
import merge from "lodash/merge";
import map from "lodash/map";
import range from "lodash/range";
import assert from "assert";
import { useStyles } from "../styles";
import { findStyleAsClassName } from "../reducers/styling";
import { List, Paragraph, Surface, Title, View } from "../styles/components";

export const MaterialListWithDetailRenderer = ({
  uischemas,
  schema,
  uischema,
  path,
  enabled,
  errors,
  visible,
  label,
  required,
  removeItems,
  addItem,
  data,
  renderers,
  cells,
  config,
  rootSchema,
  description,
  disableAdd,
  disableRemove,
  translations,
}: ArrayLayoutProps & { translations: ArrayTranslations }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

  const handleRemoveItem = useCallback(
    (p: string, value: any) => () => {
      assert(removeItems);
      assert(selectedIndex != null);
      removeItems(p, [value])();
      if (selectedIndex === value) {
        setSelectedIndex(undefined);
      } else if (selectedIndex > value) {
        setSelectedIndex(selectedIndex - 1);
      }
    },
    [removeItems, selectedIndex]
  );

  const handleListItemClick = useCallback((index: number) => () => setSelectedIndex(index), []);

  const handleCreateDefaultValue = useCallback(
    () => createDefaultValue(schema, rootSchema),
    [createDefaultValue]
  );

  const foundUISchema = useMemo(
    () =>
      findUISchema(uischemas ?? [], schema, uischema.scope, path, undefined, uischema, rootSchema),
    [uischemas, schema, uischema.scope, path, uischema, rootSchema]
  );

  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const doDisableAdd = disableAdd || appliedUiSchemaOptions.disableAdd;
  const doDisableRemove = disableRemove || appliedUiSchemaOptions.disableRemove;

  React.useEffect(() => {
    setSelectedIndex(undefined);
  }, [schema]);

  if (!visible) {
    return null;
  }

  const contextStyles = useStyles();
  const listControl = useMemo(() => findStyleAsClassName(contextStyles)("list"), [contextStyles]);
  const listControlContainer = useMemo(
    () => findStyleAsClassName(contextStyles)("list.container"),
    [contextStyles]
  );
  const listControlDetails = useMemo(
    () => findStyleAsClassName(contextStyles)("list.details"),
    [contextStyles]
  );

  return (
    <Surface className={listControl}>
      <ArrayLayoutToolbar
        translations={translations}
        label={computeLabel(label, required ?? false, appliedUiSchemaOptions.hideRequiredAsterisk)}
        description={description ?? ""}
        errors={errors}
        path={path}
        enabled={enabled}
        addItem={addItem}
        createDefault={handleCreateDefaultValue}
        disableAdd={doDisableAdd}
      />
      <View className={listControlContainer}>
        <List.Accordion title="">
          {data > 0 ? (
            map(range(data), (index) => (
              <ListWithDetailMasterItem
                index={index}
                path={path}
                schema={schema}
                enabled={enabled}
                handleSelect={handleListItemClick}
                removeItem={handleRemoveItem}
                selected={selectedIndex === index}
                key={index}
                uischema={foundUISchema}
                childLabelProp={appliedUiSchemaOptions.elementLabelProp}
                translations={translations}
                disableRemove={doDisableRemove}
              />
            ))
          ) : (
            <Paragraph>{translations.noDataMessage}</Paragraph>
          )}
        </List.Accordion>
        <View className={listControlDetails}>
          {selectedIndex !== undefined ? (
            <JsonFormsDispatch
              renderers={renderers}
              cells={cells}
              visible={visible}
              schema={schema}
              uischema={foundUISchema}
              path={composePaths(path, `${selectedIndex}`)}
            />
          ) : (
            <Title>{translations.noSelection}</Title>
          )}
        </View>
      </View>
    </Surface>
  );
};

export const materialListWithDetailTester: RankedTester = rankWith(
  4,
  and(uiTypeIs("ListWithDetail"), isObjectArray)
);

export default withJsonFormsArrayLayoutProps(
  withTranslateProps(withArrayTranslationProps(MaterialListWithDetailRenderer))
);
