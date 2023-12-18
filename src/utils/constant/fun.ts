import { ref } from 'vue'

const isOpen = ref(false)
export function useSidebar() {
  return {
    isOpen,
  }
}


export const dateConvert = (dateInput:string) : string => {
const date = new Date(dateInput);
const month = date.getMonth() + 1;
const day = date.getDate();
const year = date.getFullYear().toString().slice(-2);
const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
return formattedDate
}