/**
 * @File Name          : BaseHttpRequest.cls
 * @Description        : 
 * @Author             : Scott Kimminau
 * @Group              : 
 * @Modification Log   : 
 * @Description        : Base HttpRequest/Response class
 * Ver       Date            Author      		    Modification
 * 1.0    4/19/2021        Scott Kimminau         Initial Version
**/
public class BaseHttpRequest {
    
    public static HttpResponse callout(String endpoint, String header, String method, String body) {
        System.debug('Request body sent: ' + body);
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        HttpResponse response = null;

        request.setMethod(method);
        request.setHeader('Content-Type', 'application/json');
        request.setEndpoint(endpoint);
        request.setTimeout(60000);
        if (String.isNotBlank(body)) {
            request.setBody(body);
        }
        
        if (String.isNotBlank(header)) {
            request.setHeader('Authorization', header);
        }

        System.debug('endpoint = ' +endpoint);
        System.debug('header content= '+ request.getHeader('Content-Type'));
        System.debug('header auth= '+ request.getHeader('Authorization'));


        try {
            response = http.send(request);
            System.debug('response status code = ' +response.getStatusCode());
            System.debug('response =' +response.getBody());
        } catch (System.CalloutException callout) {
            System.debug('Callout Exception: ' + callout.getMessage());
            throw callout;
        } catch (System.Exception general) {
            System.debug('General Exception: ' + general.getMessage());
            throw general;
        }

        return response;
    }

}