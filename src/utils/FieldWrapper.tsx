import React = require("react");

interface PropsToFieldWrapper {
  isWritable: boolean;
  isReadable: boolean;
  children: JSX.Element;
}

/*
    Description: Wrapper to assign write and read permissions to <FormGroup>
      elements.

    Eliminates the need to manipulate the component to check if it has
      read (if it should be rendered) and write (`isDisabled` prop) permissions.
      The wrapper is just applicable on those <FormGroup> elements that have simple
      elements (TextInputs, selectors, etc). Due to the limitations of the wrapper,
      the complex elements attributes should be managed manually.

    Usage: Wrap the FormGroup with the wrapper providing the `isWritable`
      and `isReadable` props (from `attrbutelevelrights`).

      E.g.:
        <FieldWrapper
              isWritable={isFieldWritable(attrLevelRights.gidnumber)}
              isReadable={isFieldReadable(attrLevelRights.gidnumber)}
            >
              <FormGroup label="GID" fieldId="gid">
                <TextInput
                  id="gid"
                  name="gidnumber"
                  value={gid}
                  type="text"
                  onChange={gidInputHandler}
                  aria-label="gid"
                  // No need to add `isDisabled` here
                />
              </FormGroup>
            </FieldWrapper>

 */

const FieldWrapper = (props: PropsToFieldWrapper) => {
  // Clone the childen's children and apply the `isDisabled` prop
  const updatedSubChildren = React.Children.map(props.children, (child) => {
    const subChildren = child.props.children;
    const subChildrensArray: JSX.Element[] = subChildren;
    const newSubChildrensArray: JSX.Element[] = [];

    React.Children.map(subChildrensArray, (subChild) => {
      newSubChildrensArray.push(
        React.cloneElement(subChild, {
          isDisabled: !props.isWritable,
        }) as React.ReactElement
      );
    });

    return newSubChildrensArray;
  });

  // Clone the received component and apply the new sub-children
  const updatedChildren = React.cloneElement(
    props.children,
    {},
    updatedSubChildren
  );

  // Render component
  return <>{props.isReadable ? updatedChildren : <></>}</>;
};

export default FieldWrapper;
