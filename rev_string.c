#include "main.h"

/**
 * rev_string - reverses the order of a string
 * @s: string pointer
 */
void rev_string(char *s)
{
	int counter = 0, temp, len, low_index = 0, shift = 0;

	/*move from first character of array s to null...*/
	/*...to get the array length*/
	for (; *(s + shift);)
	{
		shift++;
	}
	len = shift;

	/*move from last character of array s to first, replacing...*/
	/*...the characters with first to last characters respectively*/
	for (shift--; counter < (len / 2); shift--)
	{
		temp = *(s + shift);
		*(s + shift) = s[low_index];
		s[low_index] = temp;
		low_index++;
		counter++;
	}
}
