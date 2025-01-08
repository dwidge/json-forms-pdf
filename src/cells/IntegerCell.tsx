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

import React, { useEffect, useState } from "react";
import { CellProps, isIntegerControl, rankWith } from "@jsonforms/core";
import { withJsonFormsCellProps } from "@jsonforms/react";
import { TextInput } from "../styles";

const toNumber = (value: string) =>
  value === "" ? undefined : parseInt(value, 10);

export const IntegerCell = (props: CellProps) => {
  const { data, id, enabled, uischema, path, handleChange } = props;
  const [inputValue, setInputValue] = useState(
    data !== undefined ? String(data) : "",
  );
  const [isValid, setIsValid] = useState(true);

  // Update local state when data prop changes
  useEffect(() => {
    setInputValue(data !== undefined ? String(data) : "");
  }, [data]);

  const handleChangeText = (value: string) => {
    setInputValue(value);
    const numberValue = toNumber(value);
    // Call handleChange only if the value is an integer
    if (numberValue !== undefined && !isNaN(numberValue)) {
      handleChange(path, numberValue);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  return (
    <TextInput
      mode="outlined"
      keyboardType="numeric"
      value={inputValue}
      onChangeText={handleChangeText}
      id={id}
      editable={enabled}
      autoFocus={uischema?.options?.focus}
      error={!isValid}
    />
  );
};

/**
 * Default tester for integer controls.
 * @type {RankedTester}
 */
export const integerCellTester = rankWith(2, isIntegerControl);

export default withJsonFormsCellProps(IntegerCell);
