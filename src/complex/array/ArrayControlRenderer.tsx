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

import range from "lodash/range";
import React, { useMemo, useState } from "react";
import { View, Button, IconButton, Text, DeleteDialog } from "../../styles";
import {
  ArrayControlProps,
  composePaths,
  createDefaultValue,
  findUISchema,
  Helpers,
  ControlElement,
  ArrayTranslations,
} from "@jsonforms/core";
import {
  JsonFormsDispatch,
  withArrayTranslationProps,
  withJsonFormsArrayControlProps,
  withTranslateProps,
} from "@jsonforms/react";
import type { VanillaRendererProps } from "../../index";
import { withVanillaControlProps } from "../../util";

const { convertToValidClassName } = Helpers;

export const ArrayControl = ({
  classNames,
  data,
  label,
  path,
  schema,
  errors,
  addItem,
  removeItems,
  moveUp,
  moveDown,
  uischema,
  uischemas,
  getStyleAsClassName,
  renderers,
  rootSchema,
  translations,
  enabled,
}: ArrayControlProps &
  VanillaRendererProps & { translations: ArrayTranslations }) => {
  const controlElement = uischema as ControlElement;
  const [showDialog, setShowDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  const childUiSchema = useMemo(
    () =>
      findUISchema(
        uischemas ?? [],
        schema,
        uischema.scope,
        path,
        undefined,
        uischema,
        rootSchema,
      ),
    [uischemas, schema, uischema.scope, path, uischema, rootSchema],
  );

  const isValid = errors.length === 0;

  const handleConfirmRemove = () => {
    if (itemToRemove !== null) {
      removeItems?.(path, [itemToRemove])();
      setItemToRemove(null);
      setShowDialog(false);
    }
  };

  return (
    <>
      <DeleteDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleConfirmRemove}
        onCancel={() => setShowDialog(false)}
        title={translations.deleteDialogTitle}
        message={translations.deleteDialogMessage}
        acceptText={translations.deleteDialogAccept}
        declineText={translations.deleteDialogDecline}
      />
      <View className="array-container">
        {!!label && (
          <Text variant="titleLarge" className="array-title">
            {label}
          </Text>
        )}
        <Button
          className="array-button"
          mode="contained"
          disabled={!enabled}
          onPress={addItem(path, createDefaultValue(schema, rootSchema))}
        >
          {translations.addTooltip}
        </Button>
        {!isValid && <Text className="error array-error">{errors}</Text>}
        {data ? (
          range(0, data.length).map((index) => {
            const childPath = composePaths(path, `${index}`);
            return (
              <View key={index} className="array-item">
                <JsonFormsDispatch
                  schema={schema}
                  uischema={childUiSchema || uischema}
                  path={childPath}
                  renderers={renderers}
                />
                <View
                  className="array-item-controls"
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <IconButton
                    icon="arrow-up"
                    aria-label={translations.up}
                    disabled={!enabled}
                    onPress={() => moveUp?.(path, index)()}
                  />
                  <IconButton
                    icon="arrow-down"
                    aria-label={translations.down}
                    disabled={!enabled}
                    onPress={() => moveDown?.(path, index)()}
                  />
                  <IconButton
                    icon="delete"
                    aria-label={translations.removeTooltip}
                    disabled={!enabled}
                    onPress={() => {
                      setItemToRemove(index);
                      setShowDialog(true);
                    }}
                  />
                </View>
              </View>
            );
          })
        ) : (
          <Text className="array-nodata">{translations.noDataMessage}</Text>
        )}
      </View>
    </>
  );
};

export const ArrayControlRenderer = ({
  schema,
  uischema,
  data,
  path,
  rootSchema,
  uischemas,
  addItem,
  getStyle,
  getStyleAsClassName,
  removeItems,
  moveUp,
  moveDown,
  id,
  visible,
  enabled,
  errors,
  translations,
}: ArrayControlProps &
  VanillaRendererProps & { translations: ArrayTranslations }) => {
  const controlElement = uischema as ControlElement;
  const labelDescription = Helpers.createLabelDescriptionFrom(
    controlElement,
    schema,
  );
  const label = labelDescription.show ? labelDescription.text : "";

  if (!visible) return null;
  return (
    <ArrayControl
      classNames={{}}
      data={data}
      label={label ?? ""}
      path={path}
      schema={schema}
      errors={errors}
      addItem={addItem}
      removeItems={removeItems}
      moveUp={moveUp}
      moveDown={moveDown}
      uischema={uischema}
      uischemas={uischemas}
      getStyleAsClassName={getStyleAsClassName}
      rootSchema={rootSchema}
      id={id}
      visible={visible}
      enabled={enabled}
      getStyle={getStyle}
      translations={translations}
    />
  );
};

export default withVanillaControlProps(
  withJsonFormsArrayControlProps(
    withTranslateProps(withArrayTranslationProps(ArrayControlRenderer)),
  ),
);
