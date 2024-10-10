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

import React from "react";
import { View } from "react-native";
import { DataTable, Text, IconButton } from "../styles";
import {
  ControlElement,
  createDefaultValue,
  JsonSchema,
  ArrayTranslations,
} from "@jsonforms/core";
import ValidationIcon from "./ValidationIcon";

export interface MaterialTableToolbarProps {
  numColumns: number;
  errors: string;
  label: string;
  description: string;
  path: string;
  uischema: ControlElement;
  schema: JsonSchema;
  rootSchema: JsonSchema;
  enabled: boolean;
  translations: ArrayTranslations;
  addItem(path: string, value: any): () => void;
  disableAdd?: boolean;
}

const TableToolbar: React.FC<MaterialTableToolbarProps> = ({
  numColumns,
  errors,
  label,
  path,
  addItem,
  schema,
  enabled,
  translations,
  rootSchema,
  disableAdd,
}) => {
  return (
    <DataTable.Header>
      <DataTable.Title>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text variant="titleLarge">{label}</Text>
          {errors.length !== 0 && (
            <ValidationIcon id="tooltip-validation" errorMessages={errors} />
          )}
        </View>
      </DataTable.Title>
      {enabled && !disableAdd && (
        <DataTable.Title numeric>
          <IconButton
            icon="plus"
            onPress={addItem(path, createDefaultValue(schema, rootSchema))}
            aria-label={translations.addAriaLabel}
          />
        </DataTable.Title>
      )}
    </DataTable.Header>
  );
};

export default React.memo(TableToolbar);
