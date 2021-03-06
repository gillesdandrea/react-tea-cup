import {Dict} from "./Dict";
import {Tuple} from "./Tuple";
import {Just, Maybe, Nothing} from "./Maybe";
import {Left, Right} from "./Either";
import {List} from "./List";
import {ListWithSelection} from "./ListWithSelection";
import {Err, Ok} from "./Result";

const DEFAULT_DISCRIMINANT = "__teacup_class_type";


function serializeDate(d: Date): string {
    return JSON.stringify({
        "__tea_date": true,
        "date": d.toISOString(),
    });
}

function deserializeDate(o: any): Date {
    return new Date(o.date);
}

function isSerializedDate(o: any): boolean {
    return o.__tea_date;
}

export class ObjectSerializer {

    private readonly prototypesMap: Dict<Object>;
    private readonly discriminantField: string;

    private constructor(prototypesMap: Dict<Object>, discriminantField?: string) {
        this.prototypesMap = prototypesMap;
        this.discriminantField = discriminantField || DEFAULT_DISCRIMINANT;
    }

    static withTeaCupClasses(): ObjectSerializer {
        return ObjectSerializer.withClasses([
            Dict,
            Left,
            Right,
            List,
            ListWithSelection,
            Just,
            Nothing,
            Ok,
            Err,
            Tuple
        ]);
    }

    static withClasses(classes: any[]): ObjectSerializer {
        return new ObjectSerializer(Dict.empty()).addClasses(classes);
    }

    addClasses(classes: any[]): ObjectSerializer {
        return new ObjectSerializer(
            Dict.fromList(
                this.prototypesMap.toList().concat(
                    classes.map(c => new Tuple(c.name, c.prototype))
                )
            )
        )
    }

    deserialize(s: string): any {
        return this.applyTransformations(JSON.parse(s));
    }

    serialize(obj: any): string {
        if (obj instanceof Date) {
            return serializeDate(obj);
        }
        if (Array.isArray(obj)) {
            return "[" +
                obj.map(x => this.serialize(x)).join(",") +
                "]";
        }
        if (typeof obj === "object") {
            const ctor = obj.constructor.name;
            const tag = ctor === "Object"
                ? ""
                : `"${this.discriminantField}": "${ctor}",`;
            return "{" + tag +
                Object.keys(obj)
                    .reduce((acc: string[],k: string) => {
                        const fieldVal = obj[k];
                        if (fieldVal !== null && fieldVal !== undefined) {
                            const v = this.serialize(obj[k]);
                            return [...acc, `"${k}":${v}`];
                        } else {
                            return acc;
                        }
                    }, [])
                    .join(",")+
                "}"
        }
        return JSON.stringify(obj);
    }

    private applyTransformations(obj: any): any {
        if (isSerializedDate(obj)) {
            return deserializeDate(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map(x => this.applyTransformations(x));
        }
        if (typeof obj === "object") {
            Object.keys(obj).forEach(key => {
                if (key === this.discriminantField) {
                    // discriminant found, assign proto
                    const proto = this.prototypesMap.get(obj[key]);
                    if (proto.type === "Just") {
                        Object.setPrototypeOf(obj, proto.value);
                    } else {
                        throw "Unable to find registered class for discriminant : \n" +
                            obj[key] + "\n" +
                            "Make sure the type is registered to DevTools' serializer";
                    }
                } else {
                    // recurse in field
                    obj[key] = this.applyTransformations(obj[key]);
                }
            });
            return obj;
        }
        return obj;
    }
}
