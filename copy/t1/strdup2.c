#include "main.h"
#include <stdlib.h>

/**
 * strdup2 - copies a string to newly allocated memory.
 * @str: pointer string to make a duplicate of.
 *
 * Return: a pointer to a newly allocated space in memory,
 * which contains a copy of the string given as a parameter.
 */
char *strdup2(char *str)
{
	int i, j;
	char *ptc;

	if (str == NULL)
	{
		return (NULL);
	}

	j = _strlen(str);
	ptc = malloc((j + 1) * sizeof(char));
	if (ptc == NULL)
	{
		return (NULL);
	}

	/*copy all the xters of str, including '\0'*/
	for (i = 0; i <= j; i++)
	{
		*(ptc + i) = *(str + i);
	}

	return (ptc);
}
