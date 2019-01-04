import {ParsingContext} from "../../ParsingContext";
import {Util} from "../../Util";
import {EntryHandlerKeyword} from "./EntryHandlerKeyword";

/**
 * Handles @graph entries.
 */
export class EntryHandlerKeywordType extends EntryHandlerKeyword {

  constructor() {
    super('@type');
  }

  public async handle(parsingContext: ParsingContext, util: Util, key: any, keys: any[], value: any, depth: number)
    : Promise<any> {
    const keyOriginal = keys[depth];
    const parentKey = await util.unaliasKeywordParent(keys, depth);

    // The current identifier identifies an rdf:type predicate.
    // But we only emit it once the node closes,
    // as it's possible that the @type is used to identify the datatype of a literal, which we ignore here.
    const context = await parsingContext.getContext(depth);
    const predicate = util.rdfType;
    const reverse = Util.isPropertyReverse(context, keyOriginal, parentKey);

    // Handle multiple values if the value is an array
    if (Array.isArray(value)) {
      for (const element of value) {
        parsingContext.getUnidentifiedValueBufferSafe(depth).push(
          { predicate, object: util.createVocabOrBaseTerm(context, element), reverse });
      }
    } else {
      parsingContext.getUnidentifiedValueBufferSafe(depth).push(
        { predicate, object: util.createVocabOrBaseTerm(context, value), reverse });
    }
  }

}
