#include "main.h"
#include <stdlib.h>

/**
 * add_rev_str - adds two numeric strings together
 * @str1: pointer to the longer string
 * @str2: pointer to the shorter, or equal-length, string
 * @len1: length, or size, of str1
 *
 * Return: a pointer to the result
 */
char *add_rev_str(char *str1, char *str2, int len1)
{
	int i, i_res, carried = 0;
	char *res;

	res = malloc(len1 + 2);
	if (res == NULL)
	{
		return (NULL);
	}

	for (i = 0; str1[i]; i++)
	{
		if (!(str2[i]))
		{
			i_res = _atoi2(str1[i]) + 0 + carried;
			res[i] = (i_res % 10) + '0';
			carried = i_res / 10;
		}
		else
		{
			i_res = _atoi2(str1[i]) + _atoi2(str2[i]) + carried;
			res[i] = (i_res % 10) + '0';
			carried = i_res / 10;
		}
	}
		
	if (carried != 0)
	{
		res[i] = carried + '0';
		res[i + 1] = '\0';
	}
	else
	{
		res[i + 1] = '\0';
	}

	return (res);
}


/**
 * _atoi2 - converts character constants from
 * 0 to 9 to actual integers
 * @c: a character constant of form '0' to '9'
 *
 * Return: an integer
 */
int _atoi2(char c)
{
	int i;

	for (i = 0; i < 10; i++)
	{
		if (c == (i + '0'))
		{
			return (i);
		}
	}
}
