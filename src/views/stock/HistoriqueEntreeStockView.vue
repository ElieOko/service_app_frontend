<script setup lang="ts">
import { columnsStockEntree } from '@/utils/constant/columun';
import { ApiRoutes } from '@/utils/constant/endpoint';
import { dateConvert } from '@/utils/constant/fun';
import type { IHistoriqueStockEntree } from '@/utils/interface/IHistoriqueStockEntree';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { process, filterBy, type CompositeFilterDescriptor, type SortDescriptor } from '@progress/kendo-data-query';
import { Grid, GridToolbar } from '@progress/kendo-vue-grid';
import { ref, watchEffect } from 'vue';
import { Loader } from '@progress/kendo-vue-indicators'

const stockEntree = ref<Array<IHistoriqueStockEntree>>([])
const loader       = ref<Boolean>(false)
const show       = ref<Boolean>(true)
const type = "infinite-spinner"
const gridPageable = {
        buttonCount: 5,
        info: true,
        type: 'numeric',
        pageSizes: true,
        previousNext: true,
      } 
  const sortable = ref(true);
  const skip = ref<number>(0);
  const take = ref<number>(4);
  const sort = ref<SortDescriptor[] | undefined>([
      { field: "TicketId", dir: "asc" }
    ]);
  const filter = ref<CompositeFilterDescriptor>({logic: "and", filters: []});
    const pageChangeHandler = (event:any) => {
      loader.value = true;
      setTimeout(() => {
       loader.value = false;
        skip.value = event.page.skip;
        take.value = event.page.take;
      }, 300);
    }

    const filterChange =  (ev:any)=> {
      loader.value = true;
      console.log(ev);
      setTimeout(() => {
        filter.value = ev.filter;
        loader.value = false;
      }, 300);
    } 

watchEffect(async()=>{
        await(useAxiosRequestWithToken().get(`${ApiRoutes.StockHistoriqueEntreeList}`)
            .then(function (response) {
              stockEntree.value = response.data.stock_historique_entree as Array<IHistoriqueStockEntree>
                stockEntree.value?.map((v:IHistoriqueStockEntree,k:number)=>{
                stockEntree.value[k].created_at = dateConvert(v.created_at)
                })
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                //alert("Elie Oko");
                show.value = false;
            }));
    })

</script>
<template>

  <h2 class="my-6 text-2xl font-semibold ">Historique Entrée Marchandise en Stock</h2> 
  <grid
    @pagechange="pageChangeHandler"
    :total ="stockEntree?.length"
    :data-items="stockEntree"
    :columns="columnsStockEntree as any"
    :edit-field="'inEdit'"
    :filter="filter"
    @filterchange="filterChange"
    :loader="loader"
    :column-menu="true"
    :pageable="gridPageable"
    :sortable="sortable"
    :sort="sort"
    :take="take"
    :skip="skip"
    >
  </grid>
  <div v-if="show" class="k-loader-container k-loader-container-md k-loader-top">
      <div class="k-loader-container-overlay k-overlay-dark" />
      <div class="k-loader-container-inner">
        <Loader :size="'large'" :type="type" />
      </div>
    </div>
</template>