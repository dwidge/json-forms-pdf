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
import { Button, Card, Title, Paragraph, Tooltip, View } from "../styles";
import ValidationIcon from "../complex/ValidationIcon";
import { ArrayTranslations } from "@jsonforms/core";

export interface ArrayLayoutToolbarProps {
  label: string;
  description: string;
  errors: string;
  path: string;
  enabled: boolean;
  addItem(path: string, data: any): () => void;
  createDefault(): any;
  translations: ArrayTranslations;
  disableAdd?: boolean;
}

export const ArrayLayoutToolbar = React.memo(function ArrayLayoutToolbar({
  label,
  description,
  errors,
  addItem,
  path,
  enabled,
  createDefault,
  translations,
  disableAdd,
}: ArrayLayoutToolbarProps) {
  return (
    <Card>
      <Card.Content>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Title>{label}</Title>
            {errors.length !== 0 && (
              <View>
                <ValidationIcon
                  id="tooltip-validation"
                  errorMessages={errors}
                />
              </View>
            )}
          </View>
          {enabled && !disableAdd && (
            <Tooltip title={translations.addTooltip ?? ""}>
              <Button
                onPress={addItem(path, createDefault())}
                aria-label={translations.addTooltip}
                mode="contained"
              >
                {translations.addTooltip}
              </Button>
            </Tooltip>
          )}
        </View>
        {description && <Paragraph>{description}</Paragraph>}
      </Card.Content>
    </Card>
  );
});
