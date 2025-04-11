import { PluginModule } from 'src/core/plugins/types';
import Greeting from './components/Greeting';

/**
 * Hello World plugin definition
 */
const helloWorldPlugin: PluginModule = {
  id: 'hello-world',
  name: 'Hello World',
  version: '1.0.0',
  description: 'A simple Hello World plugin for FreeIPA WebUI',
  author: 'FreeIPA Team',
  
  extensions: [
    {
      extensionPointId: 'dashboardContent',
      component: Greeting,
      priority: 10
    }
  ],
  
  initialize: () => {
    console.log('Hello World plugin initialized');
  },
  
  cleanup: () => {
    console.log('Hello World plugin cleaned up');
  }
};

export default helloWorldPlugin; 