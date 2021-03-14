    function loadFile(url,callback){
        JSZipUtils.getBinaryContent(url,callback);
    }
    function generate() {
        loadFile("/dist/claim.docx",function(error,content){
            if (error) { throw error };
            var zip = new JSZip(content);
            var doc=new window.docxtemplater().loadZip(zip)
            doc.setData({
               money: document.querySelector('#money').value,
               tenantName: document.querySelector('#tenantName').value,
               tenantAddress: document.querySelector('#tenantAddress').value,
               buildingAddress: document.querySelector('#buildingAddress').value,
               roomNumber: document.querySelector('#roomNumber').value,
               space: document.querySelector('#space').value,
               contractName: document.querySelector('#contractName').value,
               startDate: document.querySelector('#startDate').value
            });
            try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render()
            }
            catch (error) {
                var e = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    properties: error.properties,
                }
                console.log(JSON.stringify({error: e}));
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                throw error;
            }
            var out=doc.getZip().generate({
                type:"blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }) //Output the document using Data-URI
            saveAs(out,"output.docx")
        })
    }
    function generateContract() {
        loadFile("/dist/contract.docx",function(error,content){
            if (error) { throw error };
            var zip = new JSZip(content);
            var doc=new window.docxtemplater().loadZip(zip)
            doc.setData({
                tenantName: document.querySelector('#tenantName').value,
                tenantAddress: document.querySelector('#tenantAddress').value,
                buildingAddress: document.querySelector('#buildingAddress').value,
                roomNumber: document.querySelector('#roomNumber').value,
                space: document.querySelector('#space').value,
                contractName: document.querySelector('#contractName').value,
                startDate: document.querySelector('#startDate').value,
                finishDate: document.querySelector('#finishDate').value,
                dateNow: document.querySelector('#dateNow').value,
                tenantPerson: document.querySelector('#tenantPerson').value,
                buildingCadastr: document.querySelector('#buildingCadastr').value,
                price: document.querySelector('#price').value,
                price: document.querySelector('#price').value,
                tenantInn: document.querySelector('#tenantInn').value,
                tenantPhone: document.querySelector('#tenantPhone').value,
                tenantMail: document.querySelector('#tenantMail').value
            });
            try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render()
            }
            catch (error) {
                var e = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    properties: error.properties,
                }
                console.log(JSON.stringify({error: e}));
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                throw error;
            }
            var out=doc.getZip().generate({
                type:"blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }) //Output the document using Data-URI
            saveAs(out,"output.docx")
        })
    }
    function generateDsContinue() {
        loadFile("/dist/dscontinue.docx",function(error,content){
            if (error) { throw error };
            var zip = new JSZip(content);
            var doc=new window.docxtemplater().loadZip(zip)
            doc.setData({
                tenantName: document.querySelector('#tenantName').value,
                tenantAddress: document.querySelector('#tenantAddress').value,
                buildingAddress: document.querySelector('#buildingAddress').value,
                roomNumber: document.querySelector('#roomNumber').value,
                space: document.querySelector('#space').value,
                contractName: document.querySelector('#contractName').value,
                startDate: document.querySelector('#startDate').value,
                finishDate: document.querySelector('#finishDate').value,
                dateNow: document.querySelector('#dateNow').value,
                tenantPerson: document.querySelector('#tenantPerson').value,
                buildingCadastr: document.querySelector('#buildingCadastr').value,
                price: document.querySelector('#price').value,
                price: document.querySelector('#price').value,
                tenantInn: document.querySelector('#tenantInn').value,
                tenantPhone: document.querySelector('#tenantPhone').value,
                tenantMail: document.querySelector('#tenantMail').value,
                newDate: document.querySelector('#dateContinue').value
            });
            try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render()
            }
            catch (error) {
                var e = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    properties: error.properties,
                }
                console.log(JSON.stringify({error: e}));
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                throw error;
            }
            var out=doc.getZip().generate({
                type:"blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }) //Output the document using Data-URI
            saveAs(out,"output.docx")
        })
    }
    function generateDsStop() {
        loadFile("/dist/dsstop.docx",function(error,content){
            if (error) { throw error };
            var zip = new JSZip(content);
            var doc=new window.docxtemplater().loadZip(zip)
            doc.setData({
                tenantName: document.querySelector('#tenantName').value,
                tenantAddress: document.querySelector('#tenantAddress').value,
                buildingAddress: document.querySelector('#buildingAddress').value,
                roomNumber: document.querySelector('#roomNumber').value,
                space: document.querySelector('#space').value,
                contractName: document.querySelector('#contractName').value,
                startDate: document.querySelector('#startDate').value,
                finishDate: document.querySelector('#finishDate').value,
                dateNow: document.querySelector('#dateNow').value,
                tenantPerson: document.querySelector('#tenantPerson').value,
                buildingCadastr: document.querySelector('#buildingCadastr').value,
                price: document.querySelector('#price').value,
                price: document.querySelector('#price').value,
                tenantInn: document.querySelector('#tenantInn').value,
                tenantPhone: document.querySelector('#tenantPhone').value,
                tenantMail: document.querySelector('#tenantMail').value,
                endDate: document.querySelector('#dateEnd').value
            });
            try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render()
            }
            catch (error) {
                var e = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    properties: error.properties,
                }
                console.log(JSON.stringify({error: e}));
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                throw error;
            }
            var out=doc.getZip().generate({
                type:"blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }) //Output the document using Data-URI
            saveAs(out,"output.docx")
        })
    }