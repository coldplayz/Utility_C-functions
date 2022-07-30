#include "main.h"
#include <stdlib.h>

/**
 * mult_rev_str - multiplies two [reversed] strings
 * @s1: pointer to one of the strings
 * @s2: pointer to the other string
 * @s1len: size of s1
 * @s2len: size of s2
 *
 * Return: an array of pointer to strings of numbers to sum up
 * as the result of the multiplication
 */
char **mult_rev_str(char *s1, char *s2, int s1len, int s2len)
{
	int i, j, k, m, i_res, carried = 0, written = 0;
	char *ptc, **res;

	res = malloc((sizeof(char *) * s1len) + (sizeof(char) * (s1len + s2len) * s1len) + (sizeof(char) * s1len));
	if (res == NULL)
	{
		return (NULL);
	}

	ptc = (char *)(res + s1len);
	for (i = 0; i < s1len; i++)
	{
		res[i] = ptc + (s1len + s2len + 1) * i;
	}

	for (i = 0; s1[i]; i++)
	{
		m = 0;
		written = 0;
		for (j = 0; s2[m]; j++)
		{
			if (j == 0)
			{
				for (; j < i; j++)
				{
					res[i][j] = '0';
				}
			}
			
			i_res = _atoi2(s1[i]) * _atoi2(s2[m]) + carried;
			m++;
			res[i][j] = (i_res % 10) + '0';
			written++;
			carried = i_res / 10;
		}
		if (carried != 0)
		{
			res[i][j] = carried + '0';
			j++;
			written++;
		}
		for (k = 0; k < ((s1len + s2len) - i - written); k++)
		{
			res[i][j] = '0';
			j++;
		}
		res[i][j] = 0;
		carried = 0;
	}
	return (res);
}
