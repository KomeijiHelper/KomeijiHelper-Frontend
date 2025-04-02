import "./scss/main.scss"

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import '@fortawesome/fontawesome-free/css/all.css';
import { createVuestic } from "vuestic-ui/web-components";
import 'vuestic-ui/css';
import vuesticGlobalConfig from "./services/vuestic-ui/global-config"

const app = createApp(App);
app.use(router);
app.use(createVuestic({ config: vuesticGlobalConfig }));
app.mount("#app");