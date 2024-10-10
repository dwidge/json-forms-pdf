import React, { useEffect, useState } from "react";
import { CellProps, isIntegerControl, rankWith } from "@jsonforms/core";
import { withJsonFormsCellProps } from "@jsonforms/react";
import { TextInput } from "../styles";

const toNumber = (value: string) => (value === "" ? undefined : parseInt(value, 10));

export const IntegerCell = (props: CellProps) => {
  const { data, id, enabled, uischema, path, handleChange } = props;
  const [inputValue, setInputValue] = useState(data !== undefined ? String(data) : "");
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
