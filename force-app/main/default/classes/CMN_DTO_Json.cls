/**
 * @description Class use to store the JSON content and generates indented content using the pretty-print format.
 *
 * @author Accenture
 *
 * @date 2019
 */
global virtual class CMN_DTO_Json extends CMN_DTO_Base
{
	/**
	 * @description Suppresses null values when serializing Apex objects JSON Conenct
	 *
	 * @param prettyPrint If set to true generates indented content using the pretty-print format
	 *
	 * @return JSON string
	 */
	public String serialize(Boolean prettyPrint)
	{
		return prettyPrint ? JSON.serializePretty(this, true) : JSON.serialize(this, true);
	}

	/**
	 * @description serialise the string
	 *
	 * @return pretty serialised string
	 */
	public String serialize()
	{
		return serialize(true);
	}

}