<script lang="ts" setup>
import { ApiRoutes } from '@/utils/constant/endpoint';
import type { ICodeFacture } from '@/utils/interface/ICodeFacture';
import type { IFacturation, IFacturationRequest } from '@/utils/interface/IFacturation';
import type { IStock } from '@/utils/interface/IStock';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { process, filterBy, type CompositeFilterDescriptor, type SortDescriptor } from '@progress/kendo-data-query';
import { Grid, GridToolbar } from '@progress/kendo-vue-grid';
import { ref, watchEffect } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const columnsFacturation = [
    { field: 'id',title:"N",editable: false},
    { field:'code.nom',title:"Code Facturation",filter:'text',editable: false},
    { field:'stock.article.nom',title:"Marchandise",filter:'number',editable: false},
    { field:'quantite',title:"Quantité",filter:'number',editable: false},
    { field:'stock.article.prixUnitaire',title:"Prix Unitaire",filter:'number',editable: false},
    { field:'prixTotal',title:"Prix Total",filter:'number',editable: false},
    { field:'created_at',title:"Date de création",filter:'date',editable: false},
];
const facturation = ref<IFacturationRequest>({
    stock_fk : 0,
    quantite : 0,
    code_fk  : 0,
})
const totalPrice = ref<number>(0)
const qte  = ref<number>(0)
const mr = ref<string>("")
const printer = ():Boolean =>{
        var new_str = ((document.getElementById("printable-content")) as HTMLElement).innerHTML; 
        var old_str = document.body.innerHTML; 
        document.body.innerHTML =new_str ; 
        window.print(); 
        document.body.innerHTML = old_str;
        return false
    }
const facturationList = ref<Array<IFacturation>>([])
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
const notify = (msg:string) => {
      toast(msg, {
        autoClose: 8000,
      });
}
const code = ref<ICodeFacture>()
// const 
const stock = ref<Array<IStock>>()
    watchEffect(async()=>{
        await(useAxiosRequestWithToken().get(`${ApiRoutes.StockList}`)
            .then(function (response) {
              stock.value = response.data.stocks as Array<IStock>
              console.log( stock.value);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                //alert("Elie Oko");
            }));
    })    
const generate_code = async()=>{
    await(useAxiosRequestWithToken().get(`${ApiRoutes.CodeGenerate}`)
            .then(function (response) {
              code.value = response.data.facture_generate as ICodeFacture
                console.log( stock.value);
                notify("Votre code a été généré avec succès");
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                //alert("Elie Oko");
            }));
}

const submit_facturation = async ()=>{
  const data = (JSON.parse(JSON.stringify(facturation.value))) as IFacturationRequest ;
  if(data.code_fk == 0 || data.quantite == 0 || data.stock_fk == 0){
    notify("Entrez les informations valides");
  }
  else{
    await(useAxiosRequestWithToken().post(`${ApiRoutes.facturationCreate}`,data).then(function (response) {
              console.log(response)
                notify(response.data.message);
                if(response.data.message == "Enregistrement réussie avec succès"){
                    facturationList.value = response.data.facturation as Array<IFacturation>
                    console.log("test", facturationList) 
                   
                    facturationList.value.map((v:IFacturation,k:number)=>{
                      mr.value = v.codes.nom
                      totalPrice.value += v.prixTotal
                      qte.value += v.quantite
                    })
                }
            })
            .catch(function (error) {
               notify(error)
            })
            .finally(function () {
                //alert("Elie Oko");
            }));
  }

}
</script>
<template>
      <main class="h-full pb-16 overflow-y-auto">
                <div class="container grid px-6 mx-auto">
                   <div class="relative flex">
                        <div>
                            <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                                Sortie en stock Facturation
                            </h2>
                        </div>
                        <div class="absolute right-0">
                            <button @click="generate_code" type="button" class="text-white mt-5 bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Generer un code</button>
                        </div>
                   </div>
                    <form class="w-full"  @submit.prevent="submit_facturation">
                        <div class="flex flex-wrap -mx-3 mb-2">
                          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                                    Article dans le Stock
                                </label>
                                <div class="relative">
                                    <select v-model="facturation.stock_fk" class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                      <option v-for="(item,index) in stock" :value ="item.id">{{ item?.article?.nom }}</option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    </div>
                                </div>
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                          Quantité
                        </label>
                                <input v-model="facturation.quantite" class="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="number" placeholder="90210">
                            </div>
                        </div>
                        <div class="w-full md:w-1/2 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                                    Code Facturation
                                </label>
                                <div class="relative">
                                    <select v-model="facturation.code_fk" class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                      <option  :value ="code?.id">{{ code?.nom }}</option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    </div>
                                </div>
                            </div>
                        <button type="submit" class="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sortir au stock</button>
                        <button @click="printer" type="button" class="text-white mt-5 bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Imprimer</button>
                    </form>
                </div>
            </main>
            <div class="mt-8" />
            <main>
            <div id ="printable-content">
           
              <!-- <grid
                @pagechange="pageChangeHandler"
                :total ="facturationList?.length"
                :data-items="(facturationList as any)"
                :columns="columnsFacturation"
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
              </grid> -->

         
                    <h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
                       Facturation {{ mr }}
                    </h4>
                    <div class="w-full overflow-hidden rounded-lg shadow-xs">
                        <div class="w-full overflow-x-auto">
            <table class="w-full whitespace-no-wrap">
                                <thead>
                                    <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                        <th class="px-4 py-3">Marchandise</th>
                                        <th class="px-4 py-3">Quantité</th>
                                        <th class="px-4 py-3">Prix Unitaire</th>
                                        <th class="px-4 py-3">Prix total</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                    <tr v-for="item in facturationList" class="text-gray-700 dark:text-gray-400">
                                        <td class="px-4 py-3 text-sm">
                                            {{item.stocks.article.nom }}
                                        </td>
                                        <td class="px-4 py-3 text-sm">
                                            {{ item.quantite }}
                                        </td>
                                        <td class="px-4 py-3 text-sm">
                                          {{ item.stocks.article.prixUnitaire }}
                                        </td>
                                        <td class="px-4 py-3 text-sm">
                                            {{item.prixTotal }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                          <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                            <span class="flex items-center col-span-3">
                            {{ "Montant à payer " + totalPrice }} <br/>
                            {{ "Quantité Sortie " + qte }} <br/>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    </main>
</template>