const emailRule = [
  v => !!v || 'required',
  v => /.+@.+\..+/.test(v) || ''
]

const requiredRule = [
  v => !!v || 'required'
]

export {
  emailRule,
  requiredRule
}