/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

// for transliterating cyrillic to latin
const a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};
exports.transliterate = (word) => {
  return word.split('').map( char => a[char] || char).join("");
};

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require('moment');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// Making a static map is really long - this is a handy helper function to make one
exports.staticMap = ([lng, lat]) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${process.env.MAP_KEY}&markers=${lat},${lng}&scale=2`;

// inserting an SVG
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Some details about the site
exports.siteName = `Север`;

exports.formatDate = function(date) {
  let startDate = new Date(date);
  return (startDate.getMonth() + 1) + '.' + startDate.getDate() + '.' +  startDate.getFullYear()
}

exports.menu = [
  { slug: '/buildings', title: 'Объекты' },
  { slug: '/tenants', title: 'Арендаторы' },
  { slug: '/contracts', title: 'Договоры' },
  { slug: '/inspections', title: 'Осмотры' },
  { slug: '/users', title: 'Сотрудники' },
  { slug: '/stats', title: 'Статистика' },
  { slug: '/map', title: 'Карта' },
];

exports.buildingMenu = [
  { 
    name: 'Характеристики',
    link: '#link1' 
  },
  { 
    name: 'Фотографии',
    link: '#link2' 
  },
  { name: 'Документы',
    link: '#link3' 
  },
  { name: 'Договоры',
    link: '#link4' 
  }
];

exports.tenantMenu = [
  { 
    name: 'Информация',
    link: '#link1' 
  },
  { 
    name: 'Договоры',
    link: '#link2' 
  }
];

exports.contractMenu = [
  { 
    name: 'Информация',
    link: '#link1' 
  },
  { 
    name: 'Документы',
    link: '#link2' 
  },
  { 
    name: 'Осмотры',
    link: '#link3' 
  }
];

exports.districts = [ 
  { 
    id: 'l',
    name: 'Ленинский р-н'
  }, 
  { 
    id: 'o',
    name: 'Октябрьский р-н'
  }, 
  { 
    id: 'p',
    name: 'Первомайский р-н' 
  } 
]
