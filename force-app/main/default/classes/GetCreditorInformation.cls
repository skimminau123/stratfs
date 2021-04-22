public with sharing class GetCreditorInformation {

    @AuraEnabled(Cacheable=true)
    public static List<CreditorWrapper> getCreditorInfo() {

        String endpoint = 'callout:Strat/StrategicFS/Recruitment/master/data.json';
        HttpResponse res = BaseHttpRequest.callout(endpoint, null, 'GET', null);
       
        return (res.getStatusCode() == 200) ? (List<CreditorWrapper>) JSON.deserialize(res.getBody(), List<CreditorWrapper>.class)
                                    : new List<CreditorWrapper>();
    
    }

    public class CreditorWrapper {
        @AuraEnabled public Integer id;
        @AuraEnabled public String creditorName;
        @AuraEnabled public String firstName;
        @AuraEnabled public String lastName;
        @AuraEnabled public String minPaymentPercentage;
        @AuraEnabled public String balance;
    }

}