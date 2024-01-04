<script setup lang="ts">
import { columnsDette, columnsMarketeur } from '@/utils/constant/columun';
import { ApiRoutes } from '@/utils/constant/endpoint';
import { dateConvert } from '@/utils/constant/fun';
import type { IDette } from '@/utils/interface/IDette';
import type { IMarketeur } from '@/utils/interface/IMarketeur';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { process, filterBy, type CompositeFilterDescriptor, type SortDescriptor } from '@progress/kendo-data-query';
import { saveExcel } from '@progress/kendo-vue-excel-export';
import { Grid, GridToolbar } from '@progress/kendo-vue-grid';
import { ref, watchEffect } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const data = ref<Array<IDette>>([])
const loader       = ref<Boolean>(false)
const editField = ref<any>()
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
    const cellClick = (e: any) => {
      if (e.dataItem.inEdit && e.field === editField.value) {
        return;
      }
      exitEdit(e.dataItem, true);
      editField.value = e.field;
      e.dataItem.inEdit = e.field;
    }
    const exitEdit =  (dataItem:any, exitEdit:any) => {
      if (!exitEdit && dataItem.inEdit) {
        return;
      }
      data.value.forEach((d:any) => {
        if (d.inEdit) {
          d.inEdit = undefined;
        }
      });
      editField.value = undefined;
    }
    const itemChange =  (e:any)=> {
            const data2 =  data.value.slice();
            const index = data2.findIndex((d  => d.id === e.dataItem.id ))
            data2[index] = { ...data2[index], [e.field]: e.value };
            data.value  = data2;
        }
  const filter = ref<CompositeFilterDescriptor>({logic: "and", filters: []});
    const pageChangeHandler = (event:any) => {
      loader.value = true;
      setTimeout(() => {
       loader.value = false;
        skip.value = event.page.skip;
        take.value = event.page.take;
      }, 300);
    }
    const notify = (msg:string) => {
      toast(msg, {
        autoClose: 8000,
      });
      }
    const exportExcelFile =()=>{
      let msg = "Aucune donnée chargée..."
      if(data.value.length > 0){
         msg = "Téléchargement Effectué avec succès !"
        saveExcel({
                data: data.value,
                fileName: "Marchandise",
                columns: columnsDette
            })
      }
      notify(msg)
    }
    const filterChange =  (ev:any)=> {
      loader.value = true;
      console.log(ev);
      setTimeout(() => {
        filter.value = ev.filter;
        loader.value = false;
      }, 300);
    } 
const fetchAllData = ()=>{
    watchEffect(async()=>{
        await(useAxiosRequestWithToken().get(`${ApiRoutes.DetteList}`)
            .then(function (response) {
                data.value = response.data.dettes as Array<IDette>              
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                //alert("Elie Oko");
            }));
    })
}
fetchAllData()
    const dataUpdate = ()=>{
      loader.value = true
      data.value.map(async (art,key)=>{
        const data = JSON.parse(JSON.stringify(art));
        await(useAxiosRequestWithToken().post(`${ApiRoutes.ArticleEdit}/${art.id}`,data)
            .then(function (response) {
              console.log(response);
              if(data.value.length - 1 == key){
                fetchAllData()
                loader.value = false
              }
              
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
            }));
      })
    }
</script>
<template>
  <div class="flex flex-wrap -mx-6">
    <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
      <router-link to="dette/add" >
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
                Ajouter des nouvelles
              </h4>
              <div class="text-gray-500">
              Dettes
              </div>
            </div>
          </div>
      </router-link>
    </div>
  </div>  
  <div class="flex flex-wrap -mx-2">
    <div class=" ">
      <button type="button"  class="text-white mt-5 bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Sauvegarder les Modifications<svg v-if="loader" class="spinner inline h-6 w-6 mr-3" viewBox="0 0 4 4"></svg>
      </button>
    </div>
    <div class="">
      <button type="button"  class="text-white mt-5 bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Exportation
      </button>
    </div>
  </div>  
  <div class="mt-8" />
  <div class="wrapper">
        <grid
            @pagechange="pageChangeHandler"
            :total ="data?.length"
            :data-items="data"
            :columns="columnsDette as any"
            :edit-field="'inEdit'"
            @cellclick="cellClick"
            @itemchange="itemChange"
            :filter="filter"
            @filterchange="filterChange"
            :column-menu="true"
            :pageable="gridPageable"
            :sortable="sortable"
            :sort="sort"
            :take="take"
            :skip="skip">
        </grid>
</div>
</template>
