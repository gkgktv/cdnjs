import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
export const styles = {
  /* Styles applied to the root element. */
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: 8,
    justifyContent: 'flex-end'
  },

  /* Styles applied to the root element if `disableSpacing={false}`. */
  spacing: {
    '& > :not(:first-child)': {
      marginLeft: 8
    }
  }
};
const ExpansionPanelActions = React.forwardRef(function ExpansionPanelActions(props, ref) {
  const {
    classes,
    className,
    disableSpacing = false
  } = props,
        other = _objectWithoutPropertiesLoose(props, ["classes", "className", "disableSpacing"]);

  return React.createElement("div", _extends({
    className: clsx(classes.root, className, !disableSpacing && classes.spacing),
    ref: ref
  }, other));
});
process.env.NODE_ENV !== "production" ? ExpansionPanelActions.propTypes = {
  /**
   * The content of the component.
   */
  children: PropTypes.node.isRequired,

  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object.isRequired,

  /**
   * @ignore
   */
  className: PropTypes.string,

  /**
   * If `true`, the actions do not have additional margin.
   */
  disableSpacing: PropTypes.bool
} : void 0;
export default withStyles(styles, {
  name: 'MuiExpansionPanelActions'
})(ExpansionPanelActions);