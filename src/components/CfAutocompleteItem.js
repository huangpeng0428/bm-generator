/*
 * @Date: 2020-07-23 16:15:00
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-23 16:15:08
 */
export default {
  name: 'CfAutocompleteItem',

  functional: true,

  props: {
    item: {
      type: Object,
      required: true
    }
  },

  /* eslint-disable no-unused-vars */
  render(h, context) {
    const item = context.props.item

    return (
      <li {...context.data}>
        <div title={item.name}>{item.name}</div>
        <span title={item.value}>{item.value}</span>
      </li>
    )
  }
  /* eslint-enable no-unused-vars */
}
