import React, { useMemo } from "react";
import { EnumCellProps, isEnumControl, RankedTester, rankWith } from "@jsonforms/core";
import { withJsonFormsEnumCellProps, TranslateProps, withTranslateProps } from "@jsonforms/react";
import { i18nDefaults, withVanillaEnumCellProps } from "../util";
import type { VanillaRendererProps } from "../index";
import { Menu, Button } from "../styles";

export const EnumCell = (props: EnumCellProps & VanillaRendererProps & TranslateProps) => {
  const { data, id, enabled, schema, uischema, path, handleChange, options, t } = props;
  const noneOptionLabel = useMemo(
    () => t("enum.none", i18nDefaults["enum.none"], { schema, uischema, path }),
    [t, schema, uischema, path]
  );

  const [visible, setVisible] = React.useState(false);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={<Button onPress={() => setVisible(true)}>{data || noneOptionLabel}</Button>}
    >
      {options?.map((optionValue) => (
        <Menu.Item
          key={optionValue.value}
          onPress={() => {
            handleChange(path, optionValue.value);
            setVisible(false);
          }}
          title={optionValue.label}
        />
      ))}
    </Menu>
  );
};

export const enumCellTester: RankedTester = rankWith(2, isEnumControl);

export default withJsonFormsEnumCellProps(withTranslateProps(withVanillaEnumCellProps(EnumCell)));
