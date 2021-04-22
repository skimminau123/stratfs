import { LightningElement,wire,api,track} from 'lwc';
import getCreditorInfo from '@salesforce/apex/GetCreditorInformation.getCreditorInfo';

export default class StratFsDatatable extends LightningElement {
    
    columns = [{
        label: 'Creditor',
        fieldName: 'creditorName',
        type: 'text',
        sortable:false
    },
    {
        label: 'First Name',
        fieldName: 'firstName',
        type: 'text',
        sortable:false
    },
    {
        label: 'Last Name',
        fieldName: 'lastName',
        type: 'text',
        sortable:false
    },
    {
        label: 'Min Pay %',
        fieldName: 'minPaymentPercentage',
        type: 'text',
        sortable:false
    },
    {
        label: 'Balance',
        fieldName: 'balance',
        type: 'decimal',
        sortable:false
    }
    
];
    data = []; 
    newData = [];
    total = 0.00;
    totalRowCount = 0;
    totalCheckCount = 0;
    selectedRecords = [];
    deleteRows = [];
    isModalOpen = false;
    title='test';
    
    @wire(getCreditorInfo) 
    handleCreditInfo({ error, data }) {
    console.log('data',data);
        if (data && data.length > 0) {
            this.data = data;
            this.totalRowCount = this.data.length;

            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }

    }

    getSelectedRows(event) {
        this.deleteRows = [];
        const selectedRows = event.detail.selectedRows;
        this.selectedRecords = selectedRows;
        let tot = 0.00;
        
        for (let i = 0; i < selectedRows.length; i++){
            tot += parseInt(selectedRows[i].balance);
            this.deleteRows.push(selectedRows[i].id);
        }
        
        this.total = tot;
        this.totalCheckCount = selectedRows.length;
    }

    removeRow() {
        this.data = [...this.data];

        //should have just used this:
        //let selec = this.template.querySelector('lightning-datatable').getSelectedRows();

        if (this.selectedRecords && this.selectedRecords.length>0) { 
            this.data = [...this.data];
            
            for (let i in this.deleteRows) {
                let newIndex = this.data.findIndex(obj => obj.id == this.deleteRows[i])
                if(this.data.length>1){
                    this.data.splice(newIndex, 1);
                }else if(this.data.length == 1){
                    this.data = [];
                }
            }
            
            this.totalRowCount = this.data.length;
            this.template.querySelector('lightning-datatable').selectedRows = [];
            this.selectedRecords = [];
            this.totalCheckCount = 0;
            this.total = 0;
           
        }    
   
    }
    
    submitDetails() {
        this.closeModal();
        //let vals = this.template.querySelectorAll("lightning-input");
        let creditor = this.template.querySelector("[data-field='creditor']").value;
        let firstName = this.template.querySelector("[data-field='firstName']").value;
        let lastName = this.template.querySelector("[data-field='lastName']").value;
        let minPay = this.template.querySelector("[data-field='minPay']").value;
        let balance = this.template.querySelector("[data-field='balance']").value;
        this.data = [...this.data];

        let max = 0;
        //get max id val 
        for (let i = 0; i < this.data.length; i++) {
            let value = this.data[i].id;
            if (value > max) {
                max = value;
            }
        }

        //add it to the datatable
        this.data.push({'creditorName':creditor,
                            'firstName':firstName,
                            'lastName':lastName,
                            'id':max+1,
                            'minPaymentPercentage':parseInt(minPay).toFixed(2),
                            'balance':parseInt(balance).toFixed(2)});
                            
    }
    
    //open the modal
    addRow() {
        this.isModalOpen = true;
    }

    //close the modal
    closeModal() {
        this.isModalOpen = false;
    }

}