#include <stdio.h>
#include "lists.h"

int str_palindrome(char *str);


int main(void)
{
	long int i, j, prod;
	char *ptc, *maxpal = "0";

	for (i = 100; i < 1000; i++)
	{
		for (j = i; j < 1000; j++)
		{
			prod = i * j;
			ptc = itoa3(prod); /* to free */
			if (str_palindrome(ptc))
			{
				if (str2posint(ptc) > str2posint(maxpal))
				{
					maxpal = ptc;
				}
			}
			else
			{
				free(ptc);
			}
		}
	}

	printf("%s\n", maxpal);

	return (0);
}


/**
 * str_palindrome - checks if str is a palindrome.
 * @str: string to check.
 *
 * Return: 1 if str is a palindrome; 0 otherwise.
 */
int str_palindrome(char *str)
{
	int i, len, halflen;

	len = _strlen(str);
	halflen = len / 2;

	for (i = 0; i < halflen; i++)
	{
		if (str[i] != str[--len])
		{
			return (0);
		}
	}

	return (1);
}

