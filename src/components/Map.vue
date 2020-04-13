<template>
  <div>
    test
  </div>
</template>

<script>

export default {
  name: 'Map',
  data() {
    return {
      json: {}
    }
  },
  mounted() {
    this.json = this.$papa.parse('/NHSR_Cases_table.csv', {
      download: true
    })
    console.log(this.json);
  }
}
</script>

<style scoped>
</style>
