<script setup lang="ts">
//import { columnsFacturation } from '@/utils/constant/columun';
import { ApiRoutes } from '@/utils/constant/endpoint';
import { dateConvert } from '@/utils/constant/fun';
import type { IFacturation } from '@/utils/interface/IFacturation';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { process, filterBy, type CompositeFilterDescriptor, type SortDescriptor } from '@progress/kendo-data-query';
import { Grid, GridToolbar } from '@progress/kendo-vue-grid';
import { ref, watchEffect } from 'vue';



const columnsFacturation = [
    { field: 'id',title:"N",editable: false},
    { field:'code.nom',title:"Code Facturation",filter:'text',editable: false},
    { field:'stock.article.nom',title:"Marchandise",filter:'number',editable: false},
    { field:'quantite',title:"Quantité",filter:'number',editable: false},
    { field:'stock.article.prixUnitaire',title:"Prix Unitaire",filter:'number',editable: false},
    { field:'prixTotal',title:"Prix Total",filter:'number',editable: false},
    { field:'created_at',title:"Date de création",filter:'date',editable: false},
];
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

const data : any = [{
  "id" : 1
}]
const facturationList = ref<Array<IFacturation>>([])
watchEffect(async()=>{
        await(useAxiosRequestWithToken().get(`${ApiRoutes.facturationList}`)
            .then(function (response) {
              facturationList.value = response.data.facturation as Array<IFacturation>
               
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
      <router-link to="facturation/add" >
          <div
            class="flex items-center px-5 py-6 hover:bg-blue-200 bg-white rounded-md shadow-sm"
          >
            <div class="p-3 bg-gray-600 bg-opacity-75 rounded-full">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
            />
          </svg>
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">
                Lancez la facturation
              </h4>
              <div class="text-gray-500">
               Maintenant
              </div>
            </div>
          </div>
      </router-link>
    </div>
  </div>
  <div class="mt-8" />
  <grid
    @pagechange="pageChangeHandler"
    :total ="facturationList.length"
    :data-items="facturationList"
    :columns="columnsFacturation as any"
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