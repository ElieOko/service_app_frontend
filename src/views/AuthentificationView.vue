<script setup lang="ts">
import { setUser } from '@/stores/user';
import { ApiRoutes } from '@/utils/constant/endpoint';
import type { IAuth, IUser } from '@/utils/interface/IUser';
import { useAxiosRequestWithToken } from '@/utils/service/api';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const showLoad = ref<Boolean>(false);
const showPassword = ref<Boolean>(false);
const router = useRouter();
const auth = ref<IAuth>({
    username:'',
    password:''
  }); 
  const notify = (msg:string) => {
      toast(msg, {
        autoClose: 10000,
      });
    }
//ApiRoutes
async function login() {
  showLoad.value = true;
  
  const data = JSON.parse(JSON.stringify(auth.value));
  if(data.username == "" || data.password == ""){
    notify("Certains champs sont vide ")
    showLoad.value = false;
    return 
  }
  await useAxiosRequestWithToken().post(`${ApiRoutes.LoginUser}`,data).then(function (response) {
    // handle success
    console.log(response)
    setUser(response.data.user as IUser)
    router.push("/")
  })
  .catch(function (error) {
    // handle error
    notify(error.response.data.message)
    console.log(error);
  })
  .finally(function () {
    showLoad.value = false;
  });
}
</script>
<template>
   <div class="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div class="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
            <div class="flex flex-col overflow-y-auto md:flex-row">
                <div class="h-32  md:h-auto md:w-1/2">
                    <img aria-hidden="true" class="object-cover w-full h-full dark:hidden" src="./../../public/dm.jpeg" alt="Office" />
                    <img aria-hidden="true" class="hidden object-cover w-full h-full dark:block" src="./../../public/dm.jpeg" alt="Office" />
                </div>
                <div class="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
                  <form role="form text-left" @submit.prevent="login">
                    <div class="w-full">
                        <h1 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                           Connectez-vous maintenant avec votre compte
                        </h1>

                        <label class="block mt-4 text-sm">
                <span class="text-gray-700 dark:text-gray-400">Nom Utilisateur</span>
                <input v-model = "auth.username"
                  class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                 
                  type="text"
                />
              </label>
                        <label class="block mt-4 text-sm">
                <span class="text-gray-700 dark:text-gray-400">
                  Mot de passe
                </span>
                <input
                  v-model = "auth.password"
                  class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  placeholder="***************"
                  :type="showPassword ? 'text':'password'"
                />
              </label>
              <input v-model="showPassword" type="checkbox"/> <label>Afficher le mot de passe</label>
                        <!-- You should use a button here, as the anchor is only used for the example  -->
                  <button type="submit" class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-purple">
                      Se Connecter  <svg v-if="showLoad" class="spinner inline h-6 w-6 mr-3" viewBox="0 0 4 4"></svg>
                  </button>
                        <hr class="my-8" />
                    </div>
                  </form>
                  </div>
            </div>
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