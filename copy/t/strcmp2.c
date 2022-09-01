#include "main.h"

/**
 * _strcmp - compares two strings for greatness
 * @s1: a string
 * @s2: a string
 *
 * Return: a negative integer if s1 is less than s2;
 * a positive integer if s1 is greater than s2, and;
 * 0 if both strings are the same
 */
int _strcmp(char *s1, char *s2)
{
	int i;

	for (i = 0; (i <= (_strlen(s1) + 1)); i++)
	{
		if ((*(s1 + i) == '\0') && (*(s2 + i) == '\0'))
		{
			return (0);
		}
		else if ((*(s1 + i) == '\0') || (*(s2 + i) > *(s1 + i)))
		{
			/*return the difference between the two characters*/
			return ((*(s1 + i)) - (*(s2 + i)));
		}
		else if ((*(s2 + i) == '\0') || (*(s1 + i) > *(s2 + i)))
		{
			return ((*(s1 + i)) - (*(s2 + i)));
		}
	}
	return (0);
}
