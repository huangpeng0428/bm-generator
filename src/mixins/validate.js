const filter = (formList) => {
  return formList.filter(form => form && form.validate).map(form => form.validate())
}
export default {
  methods: {
    validate (idx) {
      let validatePromise = []
      Object.entries(this.$refs).forEach(([name, form]) => {
        if (!Array.isArray(form)) {
          form = [form]
        }
        if (!idx || name.split('_')[1] === idx + '') {
          validatePromise = validatePromise.concat(filter(form))
        }
      })
      return Promise.all(validatePromise)
                    .then(res => res.reduce((a, c) => a && c))
    }
  }
}