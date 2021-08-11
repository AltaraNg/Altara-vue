<template>
    <div>
        <div class="row my-3 mx-1">
            <stat-card :stat="obj" class="col mx-2"></stat-card>
            <stat-card :stat="obj" class="col mx-2"></stat-card>
            <stat-card :stat="obj" class="col mx-2"></stat-card>
        
        </div>

        <div>
            <!-- filters -->
            <div></div>
            <!-- table -->
            <div class="m-auto">
                <table class="table table-responsive w-100">
                    <thead>
                        <tr>
                            <th>Show room</th>
                            <th>Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Oyo</td>
                            <td>100</td>
                        </tr>
                    </tbody>
                </table>
                 
            </div>
        </div>
        
    </div>
</template>

<script>
import StatCard from '../../components/StatCard.vue'

    export default {
  components: { StatCard },
  data () {
      return {
          obj: {}
      }
  }
        
    }
</script>

<style lang="scss" scoped>

</style>