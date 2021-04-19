const emailRule = [
  v => !!v || 'required',
  v => /.+@.+\..+/.test(v) || ''
]

const requiredRule = [
  v => !!v || 'required'
]

const requiredRuleObjects = [
  v => !!v.id || 'required'
]

export {
  emailRule,
  requiredRule,
  requiredRuleObjects
}