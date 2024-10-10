import React from "react";
import {
  CellProps,
  Formatted,
  isNumberFormatControl,
  RankedTester,
  rankWith,
} from "@jsonforms/core";
import { withJsonFormsCellProps } from "@jsonforms/react";
import type { VanillaRendererProps } from "../index";
import { withVanillaCellProps } from "../util/index";
import { TextInput } from "../styles/components";

export const NumberFormatCell = (
  props: CellProps & VanillaRendererProps & Formatted<number | undefined>
) => {
  const { className, id, enabled, uischema, path, handleChange, schema } = props;
  const maxLength = schema.maxLength;
  const formattedNumber: string = props.toFormatted(props.data);

  const onChange = (value: string) => {
    const validStringNumber = props.fromFormatted(value);
    handleChange(path, validStringNumber);
  };

  return (
    <TextInput
      mode="outlined"
      label="Formatted Number"
      value={formattedNumber}
      onChangeText={onChange}
      className={className}
      testID={id}
      disabled={!enabled}
      onFocus={() => uischema.options && uischema.options.focus}
      maxLength={maxLength}
    />
  );
};

export const numberFormatCellTester: RankedTester = rankWith(4, isNumberFormatControl);

export default withJsonFormsCellProps(withVanillaCellProps(NumberFormatCell));
