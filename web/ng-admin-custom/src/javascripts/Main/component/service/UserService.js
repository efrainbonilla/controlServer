define(function () {
	'use strict';

	function UserService () {
		this.user = null;

	    this.getUser = function() {
	      return this.user;
	    };

	    this.setUser = function(user) {
	      this.user = user;
	    };

	    this.clear = function() {
	      this.user = null;
	    };
	}

	UserService.prototype.$get = function () {
		return this;
	};

	UserService.$inject = [];

	return UserService;
});