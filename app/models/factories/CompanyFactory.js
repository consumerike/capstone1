"use strict";
app.factory("CompanyFactory", function ($http, $location,fbCreds,$routeParams, UserFactory, SearchTerm ) {


    let companies = [];

//this function will give an array of Objects that are companies ("healthcare search queried") in Nashville
	 let companySearch = (searchTerms) => {
        console.log("SearchTerms?",searchTerms );
    	return new Promise((resolve, reject) => {
    		$http.get(`http://api.glassdoor.com/api/api.htm?t.p=109943&t.k=V576ve5mwm&userip=50.207.137.70&useragent=Chrome/54.0.2840.98&format=json&v=1&action=employers&country=United States&l=Nashville, TN&q=${searchTerms}`)
    		.success((EmployerObject) => {
                console.log("What is EmployerObject?",EmployerObject );

    			let employerArray = EmployerObject.response.employers;
                companies = [];
    			 employerArray.forEach(( function(element) { 
    			 	companies.push(element);
    			   }));
                  console.log("what are companies?",companies );
			}); 
    		resolve(companies);
    	// 	.error((error) => {
    	// 		reject(error);
    	// });
    	// $location.path('/companysearch');
       });
     };	
	  

     let getCompanies = function() {
        return companies;
     };








	let postNewCompany = (companyObject) => {
       
		return new Promise( (resolve, reject) => {
            companyObject.uid = UserFactory.getUser();
            console.log("companyObject.uid",companyObject.uid );
			$http.post(`${fbCreds.databaseURL}/companies.json`, angular.toJson(companyObject))
			.success((companyObject) => {
				resolve(companyObject);
			})
		
		.error( (error) => {
			reject(error);
		});
		}); 

	};

	let getMyCompanies = function () {

		let boards = [];
    	return new Promise((resolve, reject) => {
    		$http.get(`${fbCreds.databaseURL}/boards.json`)
    		.success((boardObject) => {
    			let boardCollection = boardObject;
    			Object.keys(boardCollection).forEach((key => {
    				boardCollection[key].id = key;
    				boards.push(boardCollection[key]);
    			}));
    			resolve(boards);
    		}).error((error) => {
    			reject(error);
    		});
    	});
    };



	return {companySearch, postNewCompany, getCompanies, getMyCompanies};
});