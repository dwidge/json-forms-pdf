import type { StatePropsOfMasterItem } from "@jsonforms/core";
import { withJsonFormsMasterListItemProps } from "@jsonforms/react";
import React, { useMemo } from "react";
import { useStyles } from "../styles";
import { findStyleAsClassName } from "../reducers/styling";
import { Avatar, IconButton, List, Tooltip } from "../styles/components";

export const ListWithDetailMasterItem = ({
  index,
  childLabel,
  selected,
  enabled,
  handleSelect,
  removeItem,
  path,
  translations,
  disableRemove,
}: StatePropsOfMasterItem) => {
  const contextStyles = useStyles();
  const listControl = useMemo(
    () => findStyleAsClassName(contextStyles)("list"),
    [contextStyles],
  );
  const listControlSelected = useMemo(
    () => findStyleAsClassName(contextStyles)("list.selected"),
    [contextStyles],
  );
  return (
    <List.Item
      className={selected ? listControlSelected : listControl}
      title={childLabel}
      onPress={handleSelect(index)}
      left={() => <Avatar.Text label={`${index + 1}`} />}
      right={() =>
        enabled && !disableRemove ? (
          <Tooltip
            title={translations.removeTooltip ?? ""}
            // aria-label={translations.removeAriaLabel}
          >
            <IconButton
              icon="trash-can"
              onPress={removeItem(path, index)}
              aria-label={translations.removeAriaLabel}
            />
          </Tooltip>
        ) : null
      }
    />
  );
};

export default withJsonFormsMasterListItemProps(ListWithDetailMasterItem);
