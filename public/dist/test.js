

function autocomplete(input, latInput, lngInput) {
  if(!input) return;
  const dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });

  input.addEventListener('keydown', (e) => {
    if(e.keycode === 13) e.preventDefault();
  })
}

function searchResultsHTML(results) {
  return results.map(result => {
    return `
      <a href="/buildings/${result.slug}" class="sever-search__link p-2">
        ${result.name}
      </a>
    `;
  }).join('');
}

function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('input');
  const searchResults = search.querySelector('.sever-search__results');

  searchInput.addEventListener('input', function() {
    // if there is no value, quit it!
    if (!this.value) {
      searchResults.style.display = 'none';
      return; // stop!
    }

    // show the search results!
    searchResults.style.display = 'block';

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
          return;
        }
        // tell them nothing came back
        searchResults.innerHTML = dompurify.sanitize(`<div>Ничего не найдено</div>`);
      })
      .catch(err => {
        console.error(err);
      });
  });

  // handle keyboard inputs
  searchInput.addEventListener('keyup', (e) => {
    // if they aren't pressing up, down or enter, who cares!
    if (![38, 40, 13].includes(e.keyCode)) {
      return; // nah
    }
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.sever-search__link');
    let next;
    if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1]
    } else if (e.keyCode === 38) {
      next = items[items.length - 1];
    } else if (e.keyCode === 13 && current.href) {
      window.location = current.href;
      return;
    }
    if (current) {
      current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);
  });
}

autocomplete(document.querySelector('#address'), document.querySelector('#lat'), document.querySelector('#lng'));

typeAhead(document.querySelector('.sever-search'));

script(src="/dist/plugins/jquery.min.js")
script(src="/dist/plugins/popper.min.js")
script(src="/dist/plugins/bootstrap-material-design.min.js")
script(src="/dist/plugins/jquery.dataTables.min.js")
script(src="/dist/plugins/jasny-bootstrap.min.js")
script(src="https://cdnjs.cloudflare.com/ajax/libs/core-js/2.4.1/core.js")
script(src="/dist/plugins/material-dashboard.js")
script(src="https://unpkg.com/axios/dist/axios.min.js")
script(src="/dist/plugins/dom.min.js")
script(src="/dist/test.js")