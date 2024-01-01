<script setup lang="ts">
import { columnsArticle } from '@/utils/constant/columun';
import { ApiRoutes } from '@/utils/constant/endpoint';
import { dateConvert } from '@/utils/constant/fun';
import type { IArticle } from '@/utils/interface/IArticle';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { process, filterBy, type CompositeFilterDescriptor, type SortDescriptor } from '@progress/kendo-data-query';
import { Grid, GridToolbar } from '@progress/kendo-vue-grid';
import { ref, watchEffect } from 'vue';
import { Loader } from '@progress/kendo-vue-indicators'
import { saveExcel } from '@progress/kendo-vue-excel-export';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const article = ref<Array<IArticle>>([])
const editField = ref<any>()
const type = "infinite-spinner"
const loader       = ref<Boolean>(false)
const show       = ref<any>(false)
// const  toggleLoader = () => {
    show.value = show.value ? false : 'loader';
    // }
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
      article.value.forEach((d:any) => {
        if (d.inEdit) {
          d.inEdit = undefined;
        }
      });
      editField.value = undefined;
    }
    const itemChange =  (e:any)=> {
            const data =  article.value.slice();
            const index = data.findIndex((d  => d.id === e.dataItem.id ))
            data[index] = { ...data[index], [e.field]: e.value };
            article.value  = data;
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
        await(useAxiosRequestWithToken().get(`${ApiRoutes.ArticleList}`)
            .then(function (response) {
              article.value = response.data.articles as Array<IArticle>
              article.value?.map((v:IArticle,k:number)=>{
              article.value[k].created_at = dateConvert(v.created_at)
                })                
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                //alert("Elie Oko");
                show.value = false
            }));
    })
   }
   fetchAllData()
    const dataUpdate = ()=>{
      loader.value = true
      article.value.map(async (art,key)=>{
        const data = JSON.parse(JSON.stringify(art));
        await(useAxiosRequestWithToken().post(`${ApiRoutes.ArticleEdit}/${art.id}`,data)
            .then(function (response) {
              console.log(response);
              if(article.value.length - 1 == key){
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
    const notify = (msg:string) => {
      toast(msg, {
        autoClose: 8000,
      });
      }
    const exportExcelFile =()=>{
      let msg = "Aucune donnée chargée..."
      if(article.value.length > 0){
         msg = "Téléchargement Effectué avec succès !"
        saveExcel({
                data: article.value,
                fileName: "Marchandise",
                columns: columnsArticle
            })
      }
      notify(msg)
    }
</script>
<template>
  <div class="flex flex-wrap -mx-6">
    <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
      <router-link to="article/add" >
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
              Marchandises
              </div>
            </div>
          </div>
      </router-link>
    </div>
  </div>
  <div class="flex flex-wrap -mx-2">
    <div class=" ">
      <button type="button" @click="dataUpdate" class="text-white mt-5 bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Sauvegarder les Modifications<svg v-if="loader" class="spinner inline h-6 w-6 mr-3" viewBox="0 0 4 4"></svg>
      </button>
    </div>
    <div class="">
      <button type="button" @click="exportExcelFile" class="text-white mt-5 bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Exportation
      </button>
    </div>
  </div>  

  <div class="mt-8" />
  <grid
    @pagechange="pageChangeHandler"
    :total ="article?.length"
    :data-items="article"
    :columns="columnsArticle as any"
    :edit-field="'inEdit'"
    @cellclick="cellClick"
    @itemchange="itemChange"
    :filter="filter"
    @filterchange="filterChange"
    :loader="show"
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
<style>
  .spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #25353f;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>