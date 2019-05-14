/* @flow */

import color from 'color';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import TouchableRipple from '../TouchableRipple';
import Icon from '../Icon';
import Text from '../Typography/Text';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types';

type Props = {
  /**
   * Title text for the list accordion.
   */
  title: React.Node,
  /**
   * Description text for the list accordion.
   */
  description?: React.Node,
  /**
   * Icon to display for the `ListAccordion`.
   */
  icon?: React.Node,

  /**
   * Whether the accordion is expanded
   * If this prop is provided, the accordion will behave as a "controlled component".
   * You'll need to update this prop when you want to toggle the component or on `onPress`.
   * Implemented from original PR #638 merged in nov/18 https://github.com/callstack/react-native-paper/pull/638
   */
  expanded?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  /**
   * Content of the section.
   */
  children: React.Node,
  /**
   * @optional
   */
  theme: Theme,
  style?: any,
};

type State = {
  expanded: boolean,
};

/**
 * A component used to display an expandable list item.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/list-accordion-1.png" />
 *   <img class="medium" src="screenshots/list-accordion-2.png" />
 *   <img class="medium" src="screenshots/list-accordion-3.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { ListAccordion, ListItem, Checkbox } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   state = {
 *      expanded: true
 *   }
 *
 *  _handlePress = () =>
 *    this.setState({
 *      expanded: !this.state.expanded
 *    });
 *
 *   <ListAccordion
 *      title="Accordion"
 *      icon="folder"
 *      expanded={this.state.expanded}
 *      onPress={this._handlePress}
 *   >
 *      <ListItem title="First item" />
 *      <ListItem title="Second item" />
 *   </ListAccordion>
 * );
 * ```
 */

class ListAccordion extends React.Component<Props, State> {
  state = {
    expanded: this.props.expanded || false,
  };

  _handlePress = () => {
    this.props.onPress && this.props.onPress();

    if (this.props.expanded === undefined) {
      // Only update state of the `expanded` prop was not passed
      // If it was passed, the component will act as a controlled component
      this.setState(state => ({
        expanded: !state.expanded,
      }));
    }
  };

  render() {
    const { icon, title, description, children, theme, style } = this.props;
    const titleColor = color(theme.colors.text)
      .alpha(0.87)
      .rgb()
      .string();
    const descriptionColor = color(theme.colors.text)
      .alpha(0.54)
      .rgb()
      .string();

    const expanded = this.props.expanded !== undefined
        ? this.props.expanded
        : this.state.expanded;

    return (
      <View>
        <TouchableRipple
          style={[styles.container, style]}
          onPress={this._handlePress}
        >
          <View style={styles.row} pointerEvents="none">
            {icon ? (
              <View
                style={[
                  styles.item,
                  styles.icon,
                  description && styles.multiline,
                ]}
              >
                <Icon
                  name={icon}
                  size={24}
                  color={expanded ? theme.colors.primary : descriptionColor}
                />
              </View>
            ) : null}
            <View style={[styles.item, styles.content]}>
              <Text
                numberOfLines={1}
                style={[
                  styles.title,
                  {
                    color: expanded ? theme.colors.primary : titleColor,
                  },
                ]}
              >
                {title}
              </Text>
              {description && (
                <Text
                  numberOfLines={2}
                  style={[
                    styles.description,
                    {
                      color: descriptionColor,
                    },
                  ]}
                >
                  {description}
                </Text>
              )}
            </View>
            <View style={[styles.item, description && styles.multiline]}>
              <Icon
                name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                color={titleColor}
                size={24}
              />
            </View>
          </View>
        </TouchableRipple>
        {expanded
          ? React.Children.map(children, child => {
              if (
                icon &&
                React.isValidElement(child) &&
                !child.props.icon &&
                !child.props.avatar
              ) {
                return React.cloneElement(child, {
                  style: [styles.child, child.props.style],
                });
              }

              return child;
            })
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
  },
  icon: {
    width: 40,
  },
  multiline: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
  item: {
    margin: 8,
  },
  child: {
    paddingLeft: 64,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default withTheme(ListAccordion);
