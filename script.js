let tableData = [];


fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        tableData = data;
        renderTable(tableData);
    });


function renderTable(data) {
    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = '';


    data.forEach(row => {

        const naziv = row.naziv_bolesti;
        const simptomi = row.simptomi.join(', ');
        const tretman = row.tip_tretmana;
        const faktori = row.faktori_rizika;
        const opasnost = row.razina_opasnosti;
        const lijekovi = row.uobicajeni_lijekovi;
        const testovi = row.dijagnosticki_testovi;
        const genetika = row.genetska_predispozicija;
        const brzina = row.brzina_progresije_bolesti;
        const starost = row.tipicna_starost_dijagnoze;


        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${naziv}</td>
      <td>${simptomi}</td>
      <td>${tretman}</td>
      <td>${faktori}</td>
      <td>${opasnost}</td>
      <td>${lijekovi}</td>
      <td>${testovi}</td>
      <td>${genetika}</td>
      <td>${brzina}</td>
      <td>${starost}</td>
    `;


        tableBody.appendChild(tr);
    });
}


function filterTable() {
    const filter = document.getElementById('filter-text').value.toLowerCase();
    const selected = document.getElementById('filter-select').value;





    const filteredData = tableData.filter(row => {

        if (selected === 'all') {
            let allValues = '';


            for (let key in row) {
                let value = row[key];


                if (Array.isArray(value)) {
                    allValues += value.join(', ').toLowerCase() + ' ';
                } else {
                    allValues += value.toString().toLowerCase() + ' ';
                }
            }


            return allValues.includes(filter);
        } else {

            const selectedValue = row[selected]?.toString().toLowerCase() || '';
            return selectedValue.includes(filter);
        }
    });

    renderTable(filteredData);
}


document.getElementById('filter-text').addEventListener('input', filterTable);
document.getElementById('filter-select').addEventListener('change', filterTable);

function downloadCSV() {

    const filter = document.getElementById('filter-text').value.toLowerCase();
    const selected = document.getElementById('filter-select').value;

  


    const filteredData = tableData.filter(row => {
        if (selected === 'all') {
            let allValues = '';
            for (let key in row) {
                let value = row[key];
                if (Array.isArray(value)) {
                    allValues += value.join(', ').toLowerCase() + ' ';
                } else {
                    allValues += value.toString().toLowerCase() + ' ';
                }
            }
            return allValues.includes(filter);
        } else {
            const selectedValue = row[selected]?.toString().toLowerCase() || '';
            return selectedValue.includes(filter);
        }
    });


    const rows = [];
    const header = ['Naziv bolesti', 'Simptomi', 'Vrsta tretmana', 'Faktori rizika', 'Razina opasnosti', 'Uobičajeni lijekovi', 'Dijagnostički testovi', 'Genetska predispozicija', 'Brzina progresije bolesti', 'Tipična starost dijagnoze'];
    rows.push(header.join(','));


    filteredData.forEach(row => {
        const simptomi = row.simptomi.join('; ');
        const rowData = [
            row.naziv_bolesti,
            simptomi,
            row.tip_tretmana,
            row.faktori_rizika,
            row.razina_opasnosti,
            row.uobicajeni_lijekovi,
            row.dijagnosticki_testovi,
            row.genetska_predispozicija,
            row.brzina_progresije_bolesti,
            row.tipicna_starost_dijagnoze
        ];
        rows.push(rowData.join(','));
    });


    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'filtered.csv');
    link.click();
}


function downloadJSON() {
    const filteredData = tableData.filter(row => {
        const filter = document.getElementById('filter-text').value.toLowerCase();
        const selected = document.getElementById('filter-select').value;

      
        if (selected === 'all') {
            let allValues = '';
            for (let key in row) {
                let value = row[key];
                if (Array.isArray(value)) {
                    allValues += value.join(', ').toLowerCase() + ' ';
                } else {
                    allValues += value.toString().toLowerCase() + ' ';
                }
            }
            return allValues.includes(filter);
        } else {
            const selectedValue = row[selected]?.toString().toLowerCase() || '';
            return selectedValue.includes(filter);
        }
    });

    const dataStr = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'filtered.json';
    link.click();
}

document.getElementById('download-csv').addEventListener('click', downloadCSV);
document.getElementById('download-json').addEventListener('click', downloadJSON);