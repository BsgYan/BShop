import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css'

import {Field,Form,Tag,Button,Image as VanImage,
    Swipe,SwipeItem,Lazyload,Badge,Sidebar,SidebarItem,
    Collapse,CollapseItem,Tab,Tabs,Card,
    CellGroup,
    CheckboxGroup,
    Stepper,
    Checkbox,
    SwipeCell,
    SubmitBar,
    AddressEdit,
    AddressList,
    Popup,}
    from "vant";

createApp(App)
    .use(Swipe).use(SwipeItem)
    .use(Lazyload,{
        loading:require('./assets/images/girl.jpg')
    })
    .use(Badge)
    .use(Sidebar).use(SidebarItem)
    .use(Collapse).use(CollapseItem)
    .use(Tab).use(Tabs)
    .use(Card).use(Tag)
    .use(Button).use(Form).use(Field)
    .use(CellGroup)
    .use(CheckboxGroup)
    .use(Stepper)
    .use(Checkbox)
    .use(SwipeCell)
    .use(SubmitBar)
    .use(AddressEdit)
    .use(AddressList)
    .use(Popup)
    .use(VanImage)
    .use(store)
    .use(router)

    .mount('#app')
