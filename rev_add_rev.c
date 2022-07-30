#include "main.h"
#include <stdlib.h>
#include <stdio.h>

/**
 * rev_add_rev - adds two [un-reversed] numeric strings. Undefined symbols in libuf.a
 * strings and returns the result
 * @s1: pointer to numeric string
 * @s2: pointer to numeric string
 * @revs1: an integer flag indicating whether, or not, to reverse s1
 * @revs2: an integer flag indicating whether, or not, to reverse s2
 *
 * Return: pointer to result string
 */
char *rev_add_rev(char *s1, char *s2, int revs1, int revs2)
{
	int len1 = _strlen(s1), len2 = _strlen(s2);
	char *s1cpy, *s2cpy, *res;

	s1cpy = strdup2(s1);
	s2cpy = strdup2(s2);
	printf("s1cpy, s2cpy: %s, %s\n", s1cpy, s2cpy);
	if ((s1cpy == NULL) || (s2cpy == NULL))
	{
		return (NULL);
	}

	if (revs1)
		rev_string(s1cpy);
	if (revs2)
		rev_string(s2cpy);
	printf("rev-s1cpy, rev-s2cpy: %s, %s\n", s1cpy, s2cpy);

	if (len1 > len2)
	{
		res = add_rev_str(s1cpy, s2cpy, len1);
	}
	else
	{
		res = add_rev_str(s2cpy, s1cpy, len2);
	}

	rev_string(res);

	free(s1cpy);
	free(s2cpy);

	return (res);
}
