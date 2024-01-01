<script setup lang="ts">
import { columnsMarketeur } from '@/utils/constant/columun';
import { ApiRoutes } from '@/utils/constant/endpoint';
import { dateConvert } from '@/utils/constant/fun';
import type { IMarketeur } from '@/utils/interface/IMarketeur';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { process, filterBy, type CompositeFilterDescriptor, type SortDescriptor } from '@progress/kendo-data-query';
import { Grid, GridToolbar } from '@progress/kendo-vue-grid';
import { ref, watchEffect } from 'vue';

const data = ref<Array<IMarketeur>>([])
const loader       = ref<Boolean>(false)
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
      { field: "id", dir: "asc" }
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
        await(useAxiosRequestWithToken().get(`${ApiRoutes.MarketeurList}`)
            .then(function (response) {
                data.value = response.data.marketeurs as Array<IMarketeur>              
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                //alert("Elie Oko");
            }));
    })


</script>
<template>
  <div class="flex flex-wrap -mx-6">
    <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
      <router-link to="marketeur/add" >
          <div
            class="flex items-center px-5 py-6 hover:bg-blue-200 bg-white rounded-md shadow-sm"
          >
            <div class="p-3 bg-gray-600 bg-opacity-75 rounded-full">
              <svg
              class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"
              >
              <path
              d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
            />
            <path
              fill-rule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clip-rule="evenodd"
            />
              </svg>
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">
                Ajouter des nouveaux 
              </h4>
              <div class="text-gray-500">
              Agent Marketeur
              </div>
            </div>
          </div>
      </router-link>
    </div>
  </div>  
  <div class="mt-8" />
  <grid
    @pagechange="pageChangeHandler"
    :total ="data?.length"
    :data-items="data"
    :columns="columnsMarketeur as any"
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
</template>