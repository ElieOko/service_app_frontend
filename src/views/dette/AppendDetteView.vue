<script lang="ts" setup>
import { ApiRoutes } from '@/utils/constant/endpoint';
import type { ICodeFacture } from '@/utils/interface/ICodeFacture';
import type { IDette, IDetteRequest } from '@/utils/interface/IDette';
import type { IFacturation, IFacturationRequest } from '@/utils/interface/IFacturation';
import type { IMarketeur } from '@/utils/interface/IMarketeur';
import type { IStock } from '@/utils/interface/IStock';
import type { ITypeVente } from '@/utils/interface/ITypeVente';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { process, filterBy, type CompositeFilterDescriptor, type SortDescriptor } from '@progress/kendo-data-query';
import { Grid, GridToolbar } from '@progress/kendo-vue-grid';
import { ref, watchEffect } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { Loader } from '@progress/kendo-vue-indicators'

const type                  = "infinite-spinner"
const show                  = ref<any>(false)
// const  toggleLoader = () => {
show.value = show.value ? false : 'loader';
const dette = ref<IDetteRequest>({
    code_fk: 0,
    marketeur_fk: 0,
    type_vente_fk: 0,
    quantite_emprunter: 0,
    note: "",
    observation: "",
    stock_fk: 0
})

const dette_list            = ref<Array<IDette>>([])
const totalPrice            = ref<number>(0)
const qte                   = ref<number>(0)
const mr                    = ref<string>("")
const showLoad              = ref<boolean>(false)
const printer = ():Boolean =>{
        var new_str = ((document.getElementById("printable-content")) as HTMLElement).innerHTML; 
        var old_str = document.body.innerHTML; 
        document.body.innerHTML = new_str ; 
        window.print(); 
        document.body.innerHTML = old_str;
        return false
    }
const printer2 = ():Boolean =>{
        var new_str = ((document.getElementById("printable-content2")) as HTMLElement).innerHTML; 
        var old_str = document.body.innerHTML; 
        document.body.innerHTML = new_str ; 
        window.print(); 
        document.body.innerHTML = old_str;
        return false
    }
    show.value = false
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
const nom_marketeur = ref<string>("")
const type_vente = ref<Array<ITypeVente>>([])
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
const columnsDette = [
    { field: 'id',title:"N",editable: false,width: '90px',resizable: false},
    { field:'date_creation',title:"Date Création",filter:'text',editable: false,editor: "text",width: '190px',resizable: false},
    { field:'marketeur.nom',title:"Marketeur",filter:'text',editor: "text",resizable: false,width: '120px',},
    { field:'stock.article.nom',title:"Marchandise",filter:'number',editable: false,width: '120px',resizable: false},
    {title:'Quantité',
    children: [
        { field:'quantite_emprunter',title:"Quantité Empruntée",filter:'number',editable: false,width: '158px',resizable: false},
        { field:'quantite_restante',title:"Quantité Restante",filter:'number',editable: true,editor: "text",width: '145px',resizable: false},
        { field:'quantite_vendu',title:"Quantité Vendu",filter:'number',editable: false,width: '130px',resizable: false}
    ]
    },
    {title:"Versenent Montant",
    children: [
        {field:"montant_final",title:"Montant à payer",filter:'number',editable: false,width: '158px',resizable: false},
        {field:"montant_restant",title:"Montant restant",filter:'number',editable: false,width: '158px',resizable: false},
        {field:"montant_payer",title:"Montant versé",filter:'number',editable: false,width: '158px',resizable: false},
    ]
    },
    {title:"Autres",
    children: [
    {field:"type_vente.nom",title:"Type de vente",filter:'text',editable: false,editor: "text",width: '120px',resizable: false},
    { field:'status.nom',title:"Status",filter:'text',editable: false,editor: "text",width: '100px',resizable: false},
    { field:'note',title:"Note",filter:'text',editable: true,editor: "text",width: '190px',resizable: false},
    { field:'observation',title:"Observation",filter:'text',editable: true,editor: "text",width: '190px',resizable: false},
    ]},
];//    
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
const type_v = async () =>{
    await(useAxiosRequestWithToken().get(`${ApiRoutes.TypeVenteList}`)
            .then(function (response) {
                type_vente.value = response.data.type_ventes as Array<ITypeVente>
                console.log( type_vente.value);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                //alert("Elie Oko");
    }));
}
type_v()
const submit_facturation = async ()=>{
  showLoad.value = true
  const data = (JSON.parse(JSON.stringify(dette.value))) as IDetteRequest ;
  if(data.code_fk == 0 || data.quantite_emprunter == 0 || data.stock_fk == 0 || data.marketeur_fk == 0){
    notify("Entrez les informations valides");
    showLoad.value = false
  }
  else{
    show.value = true
    await(useAxiosRequestWithToken().post(`${ApiRoutes.DetteCreate}`,data).then(function (response) {
              console.log(response)
                notify(response.data.message);
                if(response.data.message == "Enregistrement réussie avec succès"){
                    dette_list.value = response.data.dettes as Array<IDette>
                    console.log("test", facturationList) 
                    totalPrice.value = 0
                    dette_list.value.map((v:IDette,k:number)=>{
                    //   mr.value = v.code.nom
                      totalPrice.value += v.montant_final
                      nom_marketeur.value = v.marketeur.nom
                    //   qte.value += v.quantite_emprunter
                    })
                }
            })
            .catch(function (error) {
               notify(error)
            })
            .finally(function () {
                showLoad.value = false
                show.value = false
            }));
  }
}
const data = ref<Array<IMarketeur>>([])
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
      <main class="h-full pb-16 overflow-y-auto">
                <div class="container grid px-6 mx-auto">
                   <div class="relative flex">
                        <div>
                            <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                               Débuter le processus de Dette dans le système
                            </h2>
                        </div>
                        <div class="absolute right-0">
                            <button @click="generate_code" type="button" class="text-white mt-5 bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Generer un code</button>
                        </div>
                   </div>
                    <form class="w-full max-w-full p-4 z-10 py-4 bg-white shadow-md"  @submit.prevent="submit_facturation">
                        <div class="flex flex-wrap -mx-3 mb-2">
                          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                                    Article dans le Stock
                                </label>
                                <div class="relative">
                                    <select v-model="dette.stock_fk" class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
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
                                <input v-model="dette.quantite_emprunter" class="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="number">
                            </div>
                        </div>
                        <div class="flex flex-wrap -mx-3 mb-2">
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                                    Code Facturation
                                </label>
                                <div class="relative">
                                    <select v-model="dette.code_fk" class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                      <option  :value ="code?.id">{{ code?.nom }}</option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    </div>
                                </div>
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                                    Type de vente
                                </label>
                                <div class="relative">
                                    <select v-model="dette.type_vente_fk" class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                      <option v-for="item in type_vente"  :value ="item.id">{{ item.nom }}</option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div class="flex flex-wrap -mx-3 mb-2">
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                                    Nom Marketeur
                                </label>
                                <div class="relative">
                                    <select v-model="dette.marketeur_fk" class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                      <option v-for="item in data"  :value ="item.id">{{ item.nom }}</option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    </div>
                                </div>
                            </div>
                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                                    Note
                                </label>
                                <textarea v-model="dette.note" class="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" col="10" ></textarea>
                            </div> 
                        </div>
                        <button type="submit" class="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Emprunter au stock <svg v-if="showLoad" class="spinner inline h-6 w-6 mr-3" viewBox="0 0 4 4"></svg></button>
                        <button @click="printer" type="button" class="text-white mt-5 bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Imprimer</button>
                    </form>
                </div>
            </main>
            <div class="mt-8" />
            <main>
            <div id="printable-content2">
              <h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
                Dette {{ mr }}
              </h4>
                <div class="mt-8" />
              <grid
                @pagechange="pageChangeHandler"
                :total ="dette_list?.length"
                :data-items="(dette_list as any)"
                :columns="columnsDette"
                :edit-field="'inEdit'"
                @filterchange="filterChange"
                :loader="loader">
              </grid>
                    <div  class="w-full overflow-hidden rounded-lg shadow-xs">
                        <div class="w-full overflow-x-auto">
                          <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                            <span class="flex items-center col-span-3">
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    </main>
    <div id ="printable-content" class="p-4 bg-white border rounded-lg shadow-lg px-4 py-4 max-w-xl mx-auto mt-8">
        <h1 class="font-bold text-2xl my-4 text-center text-blue-600">Drapeau ya Mboka</h1>
        <hr class="mb-2">
    <div class="flex justify-between mb-6">
        <h1 class="text-lg font-bold">Bon de commande</h1>
        <div class="text-gray-700">
            <div>Numero #: {{ code?.nom }}</div>
        </div>
    </div>
    <div class="mb-8">
        <h2 class="text-lg font-bold">Adresse :</h2>
        <div class="text-gray-700 mb-2">Bokasa Olela</div>
        <div class="text-gray-700 mb-2">N° 6</div>
        <div class="text-gray-700 font-bold mb-2">Marketeur</div>
        <div class="text-gray-700">{{nom_marketeur}}</div>
    </div>
    <table class="w-full mb-8">
        <thead>
            <tr>
                <th class="text-left font-bold text-gray-700">Marchandise</th>
                <th class="text-right font-bold text-gray-700">Quantité</th>
                <th class="text-right font-bold text-gray-700">Prix Unitaire</th>
                <th class="text-right font-bold text-gray-700">Total</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in dette_list">
                <td class="text-left text-gray-700">{{ item.stock.article.nom }}</td>
                <td class="text-right text-gray-700">{{ item.quantite_emprunter }}</td>
                <td class="text-right text-gray-700">{{ item.type_vente_fk == 2 ? item.stock.article.prixUnitaire : item.stock.article.price_big }}</td>
                <td class="text-right text-gray-700">{{ item.quantite_emprunter * ( item.type_vente_fk == 2 ? item?.stock.article.prixUnitaire as any as number : item?.stock?.article?.price_big as any as number ) }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td class="text-left font-bold text-gray-700">Total</td>
                <td class="text-right font-bold text-gray-700"></td>
                <td class="text-right font-bold text-gray-700"></td>
                <td class="text-right font-bold text-gray-700">{{totalPrice}}fc</td>
            </tr>
        </tfoot>
    </table>
    <!-- <div class="text-gray-700 mb-2">Thank you for your business!</div> -->

</div>
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