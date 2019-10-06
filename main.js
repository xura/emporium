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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("interfaces/IRepository", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Emporium", ["require", "exports", "typeorm", "tsyringe"], function (require, exports, typeorm_1, tsyringe_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Emporium = /** @class */ (function () {
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
    exports.Emporium = Emporium;
});
define("adapters/HttpBin", ["require", "exports", "tsyringe", "rxjs", "async", "ky"], function (require, exports, tsyringe_2, rxjs_1, async_1, ky_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ky_1 = __importDefault(ky_1);
    var HttpBin = /** @class */ (function () {
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
    exports.HttpBin = HttpBin;
});
define("index", ["require", "exports", "tsyringe", "adapters/HttpBin", "Emporium"], function (require, exports, tsyringe_3, HttpBin_1, Emporium_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Emporium = Emporium_1.Emporium;
    var initEmporium = function () {
        tsyringe_3.container.register("IRepository", {
            useClass: HttpBin_1.HttpBin
        });
    };
    exports.initEmporium = initEmporium;
});
define("adapters/Adaptor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Adapter = /** @class */ (function () {
        function Adapter() {
        }
        return Adapter;
    }());
    exports.Adapter = Adapter;
    ;
});
//# sourceMappingURL=main.js.map