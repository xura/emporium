var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
System.register("interfaces/IRepository", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Emporium", ["typeorm", "tsyringe"], function (exports_2, context_2) {
    "use strict";
    var typeorm_1, tsyringe_1, Emporium;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (typeorm_1_1) {
                typeorm_1 = typeorm_1_1;
            },
            function (tsyringe_1_1) {
                tsyringe_1 = tsyringe_1_1;
            }
        ],
        execute: function () {
            Emporium = /** @class */ (function () {
                function Emporium(connection, model, repo) {
                    var _this = this;
                    this.repo = repo;
                    this.stream = function () {
                        return _this._getRepo().then(function (repo) { return repo.stream(); });
                    };
                    this._entityRepo = connection.getRepository(model);
                }
                Emporium.prototype._getRepo = function () {
                    if (!this.repo) {
                        return Promise.reject("No Repo injected");
                    }
                    return Promise.resolve(this.repo);
                };
                Emporium.prototype.save = function (entity) {
                    var _this = this;
                    return this._getRepo()
                        .then(function (repo) { return repo
                        .save(entity)
                        .then(function (result) { return _this._entityRepo.save(entity); }); });
                };
                Emporium.prototype.find = function () {
                    var _this = this;
                    return this._getRepo()
                        .then(function (repo) { return repo
                        .find()
                        .then((function (result) { return _this._entityRepo.find(); })); });
                };
                var _a, _b;
                Emporium = __decorate([
                    tsyringe_1.autoInjectable(),
                    __param(2, tsyringe_1.inject("IRepository")),
                    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Connection !== "undefined" && typeorm_1.Connection) === "function" ? _a : Object, typeof (_b = typeof typeorm_1.ObjectType !== "undefined" && typeorm_1.ObjectType) === "function" ? _b : Object, Object])
                ], Emporium);
                return Emporium;
            }());
            exports_2("Emporium", Emporium);
        }
    };
});
System.register("adapters/HttpBin", ["tsyringe", "rxjs", "async", "ky"], function (exports_3, context_3) {
    "use strict";
    var tsyringe_2, rxjs_1, async_1, ky_1, HttpBin;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (tsyringe_2_1) {
                tsyringe_2 = tsyringe_2_1;
            },
            function (rxjs_1_1) {
                rxjs_1 = rxjs_1_1;
            },
            function (async_1_1) {
                async_1 = async_1_1;
            },
            function (ky_1_1) {
                ky_1 = ky_1_1;
            }
        ],
        execute: function () {
            HttpBin = /** @class */ (function () {
                function HttpBin() {
                    var _this = this;
                    this._store = new rxjs_1.Subject();
                    this._queue = async_1.queue(function (task, callback) {
                        _this._store.next(task);
                        callback();
                    }, 2);
                    this.stream = function () { return Promise.resolve(_this._store); };
                }
                HttpBin.prototype.save = function (entity) {
                    this._queue.push(entity, function () { return ky_1.default.post('https://httpbin.org/post'); });
                    return Promise.resolve(entity);
                };
                HttpBin.prototype.find = function () {
                    return Promise.resolve([]);
                };
                HttpBin = __decorate([
                    tsyringe_2.injectable(),
                    tsyringe_2.singleton()
                ], HttpBin);
                return HttpBin;
            }());
            exports_3("HttpBin", HttpBin);
        }
    };
});
System.register("index", ["tsyringe", "adapters/HttpBin", "Emporium"], function (exports_4, context_4) {
    "use strict";
    var tsyringe_3, HttpBin_1, Emporium_1, initEmporium;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (tsyringe_3_1) {
                tsyringe_3 = tsyringe_3_1;
            },
            function (HttpBin_1_1) {
                HttpBin_1 = HttpBin_1_1;
            },
            function (Emporium_1_1) {
                Emporium_1 = Emporium_1_1;
            }
        ],
        execute: function () {
            exports_4("Emporium", Emporium_1.Emporium);
            initEmporium = function () {
                tsyringe_3.container.register("IRepository", {
                    useClass: HttpBin_1.HttpBin
                });
            };
            exports_4("initEmporium", initEmporium);
        }
    };
});
System.register("adapters/Adaptor", [], function (exports_5, context_5) {
    "use strict";
    var Adapter;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            Adapter = /** @class */ (function () {
                function Adapter() {
                }
                return Adapter;
            }());
            exports_5("Adapter", Adapter);
            ;
        }
    };
});
//# sourceMappingURL=main.js.map