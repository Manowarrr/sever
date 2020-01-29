import '../sass/style.scss';

import 'bootstrap';
//import './modules/plugins/bootstrap-selectpicker';
import './modules/jasny-bootstrap';
import './modules/fileInput';
import './modules/material-dashboard';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
//import generateDoc from './modules/generateDoc';


autocomplete(document.querySelector('#address'), document.querySelector('#lat'), document.querySelector('#lng'));

typeAhead(document.querySelector('.sever-search'));

makeMap(document.querySelector('#map'));

