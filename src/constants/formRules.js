const emailRule = [
  v => !!v || 'required',
  v => /.+@.+\..+/.test(v) || ''
]

const requiredRule = [
  v => !!v || 'required'
]

const requiredRuleObjects = [
  v => Object.keys(v).length === 0 || 'required'
]

const onlyNumbers = [
  v => /^\d*\.?\d*$/.test(v) || this.$t('no_number')
]

export {
  emailRule,
  requiredRule,
  requiredRuleObjects,
  onlyNumbers
}